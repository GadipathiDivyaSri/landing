const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

// Serve static files with automatic html extension resolution
app.use(express.static(__dirname, {
  extensions: ['html', 'htm']
}));

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

app.listen(PORT, '0.0.0.0', () => {
  console.log(`WrindhaOS server running on http://0.0.0.0:${PORT}`);
});
