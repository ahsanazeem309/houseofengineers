const multer = require('multer');
const FileType = require('file-type');
const sharp = require('sharp');
const path = require('path');
const sanitizeHtml = require('sanitize-html');

// 1. Configure Multer Memory Storage (keep in buffer for magic-number inspection)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB strict limit
    files: 10 // Max 10 files per batch upload
  }
});

// Allowed MIME types
const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/svg+xml'
]);

/**
 * Sanitize filename to prevent directory traversal or filesystem vulnerabilities
 */
function sanitizeFilename(originalName) {
  if (!originalName || typeof originalName !== 'string') {
    return 'asset';
  }
  // Strip paths, null bytes, and keep only safe characters
  const basename = path.basename(originalName).replace(/\0/g, '');
  const clean = basename
    .replace(/[^a-zA-Z0-9._-]/g, '-')
    .replace(/-+/g, '-')
    .toLowerCase();
  return clean.substring(0, 100);
}

/**
 * Inspects binary magic numbers and processes the uploaded image buffer
 */
async function processAndValidateFile(file) {
  if (!file || !file.buffer) {
    throw new Error('No file buffer provided for processing.');
  }

  let mimeType = null;
  let isSvg = false;

  // 1. Check for SVG
  const bufferHead = file.buffer.slice(0, 100).toString('utf8').trim().toLowerCase();
  if (bufferHead.includes('<svg') || bufferHead.includes('<?xml')) {
    isSvg = true;
    mimeType = 'image/svg+xml';
  } else {
    // 2. Magic-number binary check using file-type
    const typeResult = await FileType.fromBuffer(file.buffer);
    if (!typeResult) {
      throw new Error('Security Error: Unable to verify file binary signature. Unknown or unsupported file type.');
    }
    mimeType = typeResult.mime;
  }

  if (!ALLOWED_MIME_TYPES.has(mimeType)) {
    throw new Error(`Security Error: Forbidden file type [${mimeType}]. Only WebP, PNG, JPEG, and SVG images are permitted.`);
  }

  const sanitizedBase = sanitizeFilename(file.originalname);
  const timestamp = Date.now();
  const randomSuffix = Math.random().toString(36).substring(2, 8);

  // 3. SVG Security Sanitization
  if (isSvg) {
    const rawSvg = file.buffer.toString('utf8');
    // Strip <script> and dangerous attributes from SVG
    const safeSvg = sanitizeHtml(rawSvg, {
      allowedTags: ['svg', 'g', 'path', 'rect', 'circle', 'line', 'polyline', 'polygon', 'text', 'defs', 'title'],
      allowedAttributes: {
        '*': ['fill', 'stroke', 'stroke-width', 'viewBox', 'width', 'height', 'd', 'transform', 'class', 'id', 'xmlns', 'cx', 'cy', 'r', 'x', 'y', 'x1', 'y1', 'x2', 'y2']
      }
    });

    const safeBuffer = Buffer.from(safeSvg, 'utf8');
    const safeKey = `${timestamp}-${randomSuffix}-${sanitizedBase.replace(/\.svg$/, '')}.svg`;

    return {
      buffer: safeBuffer,
      mimeType: 'image/svg+xml',
      originalName: file.originalname,
      key: safeKey,
      dimensions: { width: 800, height: 800 },
      fileSize: safeBuffer.length
    };
  }

  // 4. Sharp Raster Image Optimization Pipeline
  // Strip malicious EXIF, re-encode to WebP, extract dimensions
  const image = sharp(file.buffer);
  const metadata = await image.metadata();

  // Re-encode to high-quality compressed WebP
  const optimizedBuffer = await image
    .rotate() // Auto-orient based on EXIF
    .webp({ quality: 82, effort: 4 })
    .toBuffer();

  const safeKey = `${timestamp}-${randomSuffix}-${sanitizedBase.replace(/\.[^.]+$/, '')}.webp`;

  return {
    buffer: optimizedBuffer,
    mimeType: 'image/webp',
    originalName: file.originalname,
    key: safeKey,
    dimensions: {
      width: metadata.width || 0,
      height: metadata.height || 0
    },
    fileSize: optimizedBuffer.length
  };
}

/**
 * XSS HTML Sanitizer Options for Modular Block Content
 */
const SANITIZE_OPTIONS = {
  allowedTags: [
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'a', 'b', 'i', 'strong', 'em', 'strike',
    'ul', 'ol', 'li', 'blockquote', 'code', 'pre', 'hr', 'br', 'span'
  ],
  allowedAttributes: {
    'a': ['href', 'target', 'rel', 'title', 'class'],
    'span': ['class', 'style'],
    '*': ['class']
  },
  allowedSchemes: ['http', 'https', 'mailto', 'tel'],
  transformTags: {
    'a': sanitizeHtml.simpleTransform('a', { rel: 'noopener noreferrer' })
  }
};

/**
 * Recursively sanitize strings inside a structured block object to prevent XSS
 */
function sanitizeBlockData(data) {
  if (!data) return data;
  if (typeof data === 'string') {
    // If it looks like HTML, sanitize it; otherwise return clean string
    if (data.includes('<') && data.includes('>')) {
      return sanitizeHtml(data, SANITIZE_OPTIONS);
    }
    return data;
  }
  if (Array.isArray(data)) {
    return data.map(item => sanitizeBlockData(item));
  }
  if (typeof data === 'object') {
    const cleaned = {};
    for (const [key, value] of Object.entries(data)) {
      cleaned[key] = sanitizeBlockData(value);
    }
    return cleaned;
  }
  return data;
}

/**
 * Middleware: Process single or multiple uploaded files with security validation
 */
async function validateUploadSecurity(req, res, next) {
  try {
    if (req.file) {
      req.processedFile = await processAndValidateFile(req.file);
    } else if (req.files && Array.isArray(req.files) && req.files.length > 0) {
      req.processedFiles = await Promise.all(
        req.files.map(file => processAndValidateFile(file))
      );
    }
    next();
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err.message || 'File upload security validation failed.'
    });
  }
}

module.exports = {
  upload,
  validateUploadSecurity,
  processAndValidateFile,
  sanitizeBlockData,
  sanitizeFilename
};
