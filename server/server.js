const path = require('path');
const fs = require('fs');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');
const contactRoutes = require('./routes/contactRoutes');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const contentRoutes = require('./routes/contentRoutes');
const mediaRoutes = require('./routes/mediaRoutes');
const pageRoutes = require('./routes/pageRoutes');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security Headers
app.use(helmet());

// Cross-Origin Resource Sharing
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:3000',
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (e.g. mobile apps, curl, postman) or matching origins
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, true); // Permissive in dev, can restrict in strict prod
      }
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
  })
);

// Body Parsers
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Request Logging Middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[HTTP] ${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`);
  });
  next();
});

// API Routes
app.use('/api', contactRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/admin/media', mediaRoutes);
app.use('/api/admin/pages', pageRoutes);
app.use('/api/content', contentRoutes);

// Secure Static Uploads Serving
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  try { fs.mkdirSync(uploadsDir, { recursive: true }); } catch (_) {}
}

app.use('/uploads', (req, res, next) => {
  // Enforce non-executable, strict MIME sniffing defense headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Content-Security-Policy', "default-src 'none'; style-src 'unsafe-inline'; sandbox");
  res.setHeader('Cache-Control', 'public, max-age=86400');
  next();
}, express.static(uploadsDir));

// Static Asset Serving (Production & Local Previews)
const clientDistPath = path.join(__dirname, '../client/dist');
if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));
  
  // Client SPA fallback for non-API and non-uploads routes
  app.get('*', (req, res, next) => {
    if (req.originalUrl.startsWith('/api') || req.originalUrl.startsWith('/uploads')) {
      return next();
    }
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
} else {
  // Root route fallback when client dist has not been compiled
  app.get('/', (req, res) => {
    res.json({
      name: 'House of Engineers Pvt. Ltd. API',
      status: 'online',
      endpoints: {
        health: '/api/health',
        contact: 'POST /api/contact'
      }
    });
  });
}

// 404 Handler for unhandled API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `API Endpoint ${req.method} ${req.originalUrl} not found.`
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Global Server Error]:', err);
  res.status(500).json({
    success: false,
    message: 'An unexpected server error occurred.',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start Server only if executed directly (not when imported as a serverless handler)
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(` House of Engineers Pvt. Ltd. API Server`);
    console.log(` Running on: http://localhost:${PORT}`);
    console.log(` Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(` Health Check: http://localhost:${PORT}/api/health`);
    console.log(`====================================================`);
  });
}

module.exports = app;
