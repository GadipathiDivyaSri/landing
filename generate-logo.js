const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const imagesDir = path.join(__dirname, 'Images');
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

// Crisp, modern SVG logo for WrindhaOS
const svgLogo = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#082F49"/>
      <stop offset="50%" stop-color="#0C4A6E"/>
      <stop offset="100%" stop-color="#0369A1"/>
    </linearGradient>
    <linearGradient id="cyanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38BDF8"/>
      <stop offset="100%" stop-color="#0284C7"/>
    </linearGradient>
    <linearGradient id="accentGrad" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#0EA5E9"/>
      <stop offset="100%" stop-color="#E0F2FE"/>
    </linearGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="#0EA5E9" flood-opacity="0.35"/>
    </filter>
  </defs>

  <!-- Squircle Base -->
  <rect width="512" height="512" rx="112" fill="url(#bgGrad)" />
  <rect x="8" y="8" width="496" height="496" rx="104" fill="none" stroke="rgba(255,255,255,0.12)" stroke-width="4" />

  <!-- Background Subtle Grid / Focus Ring -->
  <circle cx="256" cy="256" r="160" fill="none" stroke="rgba(14,165,233,0.15)" stroke-width="2" stroke-dasharray="8 8"/>
  <circle cx="256" cy="256" r="210" fill="none" stroke="rgba(14,165,233,0.08)" stroke-width="1.5"/>

  <!-- WrindhaOS 'W' Stylized Focus Wings Logo -->
  <g filter="url(#glow)" transform="translate(0, 10)">
    <!-- Left Wing / Pillar -->
    <path d="M120 148 L175 148 L220 330 L180 330 Z" fill="url(#cyanGrad)" />
    <!-- Left Inner Connector -->
    <path d="M180 330 L220 330 L256 220 L230 200 Z" fill="#0284C7" />
    
    <!-- Right Inner Connector -->
    <path d="M332 330 L292 330 L256 220 L282 200 Z" fill="#0284C7" />
    <!-- Right Wing / Pillar -->
    <path d="M392 148 L337 148 L292 330 L332 330 Z" fill="url(#cyanGrad)" />

    <!-- Center Apex Diamond / North Star (Goal Clarity & Focus) -->
    <polygon points="256,120 286,168 256,216 226,168" fill="url(#accentGrad)" />
    
    <!-- Core Center V-Shield -->
    <path d="M226 230 L256 340 L286 230 L256 250 Z" fill="#38BDF8" />
  </g>

  <!-- Lower Brand Monogram Accent Bar -->
  <rect x="196" y="385" width="120" height="8" rx="4" fill="url(#cyanGrad)" opacity="0.9" />
</svg>`;

// Save SVG
fs.writeFileSync(path.join(imagesDir, 'logo.svg'), svgLogo);

// Render JPEG and PNG
async function buildImages() {
  const svgBuffer = Buffer.from(svgLogo);

  await sharp(svgBuffer)
    .jpeg({ quality: 95 })
    .toFile(path.join(imagesDir, 'Image1.jpeg'));

  await sharp(svgBuffer)
    .png()
    .toFile(path.join(imagesDir, 'Image1.png'));

  await sharp(svgBuffer)
    .png()
    .toFile(path.join(imagesDir, 'logo.png'));

  await sharp(svgBuffer)
    .png()
    .toFile(path.join(imagesDir, 'icon.png'));

  console.log('Successfully generated all logo formats and aliases in /Images');
}

buildImages().catch(console.error);
