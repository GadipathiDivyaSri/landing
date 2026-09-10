require('dotenv').config();
const express = require('express');
const compression = require('compression');
const path = require('path');

const app = express();
const PORT = 3000;

// Remove Express fingerprint header
app.disable('x-powered-by');

// Enable Gzip/Brotli compression for production performance
app.use(compression());

// Security & baseline HTTP headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

// Body parsing middleware
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Lazy Supabase client initialization
let supabaseClient = null;

function getSupabase() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return null;
  }

  if (!supabaseClient) {
    try {
      const { createClient } = require('@supabase/supabase-js');
      supabaseClient = createClient(supabaseUrl, supabaseKey, {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      });
      console.log('Supabase client initialized successfully with URL:', supabaseUrl);
    } catch (err) {
      console.error('Failed to initialize Supabase client:', err.message);
      return null;
    }
  }

  return supabaseClient;
}

// In-memory fallback queue for waitlist entries when Supabase credentials are not yet set
const localWaitlistQueue = [];

// Production Liveness & Readiness Probes (Cloud Run, Kubernetes, Docker, Uptime Monitors)
const healthCheckHandler = (req, res) => {
  res.status(200).json({
    status: 'healthy',
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'production',
  });
};

app.get('/health', healthCheckHandler);
app.get('/healthz', healthCheckHandler);

// Detailed API Status & diagnostics endpoint
app.get('/api/status', (req, res) => {
  const isSupabaseConfigured = Boolean(
    process.env.SUPABASE_URL && (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY)
  );

  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    supabaseConfigured: isSupabaseConfigured,
    supabaseUrlProvided: Boolean(process.env.SUPABASE_URL),
    localEntriesQueued: localWaitlistQueue.length,
  });
});

// Waitlist submission endpoint (Supabase integration)
const handleWaitlistSubmission = async (req, res, next) => {
  try {
    const { name, email, phone } = req.body || {};

    // Input validation
    const cleanName = (typeof name === 'string' ? name : '').trim();
    const cleanEmail = (typeof email === 'string' ? email : '').trim().toLowerCase();
    const cleanPhone = (typeof phone === 'string' ? phone : '').trim();

    if (!cleanName || !cleanEmail) {
      return res.status(400).json({
        success: false,
        error: 'Name and Email are required fields.',
      });
    }

    // Basic email regex validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a valid email address.',
      });
    }

    const supabase = getSupabase();

    if (supabase) {
      const { data, error } = await supabase
        .from('join_details')
        .insert({
          name: cleanName,
          email: cleanEmail,
          phone: cleanPhone || null,
          created_at: new Date().toISOString(),
        })
        .select();

      if (error) {
        console.error('Supabase insert error in join_details:', error);
        return res.status(502).json({
          success: false,
          error: error.message || 'Database error occurred while submitting.',
        });
      }

      console.log(`Waitlist entry saved to Supabase: ${cleanEmail}`);
      return res.status(200).json({
        success: true,
        provider: 'supabase',
        message: 'Thank you! Your details have been submitted to the waitlist.',
        data,
      });
    }

    // Graceful fallback when SUPABASE_URL / SUPABASE_KEY have not been provided yet
    console.warn(
      `[Notice] Supabase credentials not yet configured in environment variables. Storing waitlist entry in local queue: ${cleanEmail}`
    );

    const localRecord = {
      id: `local_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      name: cleanName,
      email: cleanEmail,
      phone: cleanPhone || null,
      submitted_at: new Date().toISOString(),
      status: 'queued_pending_supabase_config',
    };

    localWaitlistQueue.push(localRecord);

    return res.status(200).json({
      success: true,
      provider: 'local_fallback',
      message: 'Thank you! Your details have been recorded.',
      note: 'Supabase credentials pending configuration in environment variables.',
    });
  } catch (err) {
    next(err);
  }
};

app.post('/api/waitlist', handleWaitlistSubmission);
app.post('/api/join', handleWaitlistSubmission);

// Serve static files with automatic html extension resolution and asset caching
app.use(
  express.static(__dirname, {
    extensions: ['html', 'htm'],
    maxAge: process.env.NODE_ENV === 'production' ? '1d' : 0,
    setHeaders: (res, filePath) => {
      // Long-term caching for static images/icons
      if (/\.(png|jpe?g|svg|ico|webp)$/i.test(filePath)) {
        res.setHeader('Cache-Control', 'public, max-age=86400, stale-while-revalidate=604800');
      }
    },
  })
);

// Route fallback for clean URLs or missing files
app.get('*', (req, res) => {
  const filePath = path.join(__dirname, req.path);
  if (req.path !== '/' && !path.extname(req.path)) {
    const htmlPath = `${filePath}.html`;
    return res.sendFile(htmlPath, (err) => {
      if (err) {
        res.sendFile(path.join(__dirname, 'index.html'));
      }
    });
  }
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Centralized error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal Server Error',
  });
});

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`WrindhaOS server running on http://0.0.0.0:${PORT}`);
  console.log(
    `Supabase status: ${
      process.env.SUPABASE_URL ? 'Credentials provided' : 'No credentials set (running in graceful fallback mode)'
    }`
  );
});

// Graceful shutdown handling for container termination (Cloud Run, Kubernetes, Docker)
const handleShutdown = (signal) => {
  console.log(`${signal} received: closing HTTP server gracefully...`);
  server.close(() => {
    console.log('HTTP server closed. Exiting process.');
    process.exit(0);
  });

  // Force close after 10s if hanging connections exist
  setTimeout(() => {
    console.error('Forced shutdown after timeout.');
    process.exit(1);
  }, 10000).unref();
};

process.on('SIGTERM', () => handleShutdown('SIGTERM'));
process.on('SIGINT', () => handleShutdown('SIGINT'));

