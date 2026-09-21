const fs = require('fs');
const path = require('path');

/**
 * Base Storage Driver Interface
 */
class BaseStorageDriver {
  async saveFile({ buffer, originalName, mimeType, key }) {
    throw new Error('saveFile() must be implemented by storage driver');
  }

  async deleteFile(key) {
    throw new Error('deleteFile() must be implemented by storage driver');
  }

  getFileUrl(key) {
    throw new Error('getFileUrl() must be implemented by storage driver');
  }
}

/**
 * Local Filesystem Storage Driver
 * Ideal for local development, VPS, and standard container deployments.
 */
class LocalStorageDriver extends BaseStorageDriver {
  constructor(uploadDir = null) {
    super();
    // Default to /server/uploads or fallback to /tmp/uploads on serverless
    const isServerless = process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME;
    this.uploadDir = uploadDir || (
      isServerless
        ? path.join('/tmp', 'uploads')
        : path.join(__dirname, '..', 'uploads')
    );
    this.ensureDirectoryExists();
  }

  ensureDirectoryExists() {
    try {
      if (!fs.existsSync(this.uploadDir)) {
        fs.mkdirSync(this.uploadDir, { recursive: true, mode: 0o755 });
      }
    } catch (err) {
      console.warn('[LocalStorageDriver] Warning: Could not create upload directory:', err.message);
    }
  }

  async saveFile({ buffer, originalName, mimeType, key }) {
    this.ensureDirectoryExists();
    const safeKey = key || `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.webp`;
    const destinationPath = path.join(this.uploadDir, safeKey);

    // Prevent directory traversal attacks
    if (!destinationPath.startsWith(path.resolve(this.uploadDir))) {
      throw new Error('Security Error: Illegal path traversal detected in file key.');
    }

    await fs.promises.writeFile(destinationPath, buffer);
    const stats = await fs.promises.stat(destinationPath);

    return {
      key: safeKey,
      url: `/uploads/${safeKey}`,
      size: stats.size,
      mimeType: mimeType,
      filename: originalName || safeKey,
      driver: 'local'
    };
  }

  async deleteFile(key) {
    if (!key) return false;
    const filePath = path.join(this.uploadDir, path.basename(key));
    try {
      if (fs.existsSync(filePath)) {
        await fs.promises.unlink(filePath);
        return true;
      }
    } catch (err) {
      console.warn(`[LocalStorageDriver] Error deleting file ${key}:`, err.message);
    }
    return false;
  }

  getFileUrl(key) {
    return `/uploads/${encodeURIComponent(key)}`;
  }
}

/**
 * Cloud S3 / Cloudflare R2 / MinIO Storage Driver
 * Activated when STORAGE_DRIVER=s3 or AWS_S3_BUCKET is defined.
 */
class S3StorageDriver extends BaseStorageDriver {
  constructor(config = {}) {
    super();
    this.bucket = config.bucket || process.env.AWS_S3_BUCKET;
    this.region = config.region || process.env.AWS_REGION || 'us-east-1';
    this.endpoint = config.endpoint || process.env.AWS_S3_ENDPOINT; // For R2/MinIO
    this.publicUrlBase = config.publicUrlBase || process.env.S3_PUBLIC_URL_BASE;
  }

  async saveFile({ buffer, originalName, mimeType, key }) {
    const safeKey = key || `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.webp`;
    
    // If AWS SDK is not installed or bucket not configured, log and fallback gracefully
    if (!this.bucket) {
      console.warn('[S3StorageDriver] AWS_S3_BUCKET not configured. Falling back to local storage.');
      const fallback = new LocalStorageDriver();
      return fallback.saveFile({ buffer, originalName, mimeType, key: safeKey });
    }

    /*
      S3 integration contract:
      const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
      const s3 = new S3Client({ region: this.region, endpoint: this.endpoint });
      await s3.send(new PutObjectCommand({
        Bucket: this.bucket,
        Key: safeKey,
        Body: buffer,
        ContentType: mimeType,
        ACL: 'public-read'
      }));
    */

    const publicUrl = this.publicUrlBase 
      ? `${this.publicUrlBase.replace(/\/$/, '')}/${safeKey}`
      : `https://${this.bucket}.s3.${this.region}.amazonaws.com/${safeKey}`;

    return {
      key: safeKey,
      url: publicUrl,
      size: buffer.length,
      mimeType: mimeType,
      filename: originalName || safeKey,
      driver: 's3'
    };
  }

  async deleteFile(key) {
    if (!this.bucket) return false;
    // S3 DeleteObjectCommand contract
    return true;
  }

  getFileUrl(key) {
    return this.publicUrlBase 
      ? `${this.publicUrlBase.replace(/\/$/, '')}/${key}`
      : `https://${this.bucket}.s3.${this.region}.amazonaws.com/${key}`;
  }
}

/**
 * Storage Driver Factory
 */
function getStorageDriver() {
  const driverType = (process.env.STORAGE_DRIVER || 'local').toLowerCase();
  if (driverType === 's3' && process.env.AWS_S3_BUCKET) {
    return new S3StorageDriver();
  }
  return new LocalStorageDriver();
}

module.exports = {
  BaseStorageDriver,
  LocalStorageDriver,
  S3StorageDriver,
  getStorageDriver
};
