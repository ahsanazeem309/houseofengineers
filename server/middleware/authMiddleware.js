const jwt = require('jsonwebtoken');
const db = require('../data/db');

const JWT_SECRET = process.env.JWT_SECRET || 'hoe-super-secret-key-2026-industrial';

const requireAdminAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. Authentication token required.'
    });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const admin = db.findAdminByEmail(decoded.email);
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Admin account not found or revoked.'
      });
    }

    req.user = {
      id: admin.id,
      email: admin.email,
      name: admin.name,
      role: admin.role || 'editor'
    };
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired session token. Please log in again.'
    });
  }
};

/**
 * Role-Based Access Control (RBAC) Guard
 * @param {string[]} allowedRoles e.g. ['superadmin'] or ['superadmin', 'editor']
 */
const requireRole = (allowedRoles = ['superadmin']) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required before role verification.'
      });
    }

    const userRole = req.user.role || 'editor';
    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: Role [${userRole}] does not have required permissions (${allowedRoles.join(' or ')}).`
      });
    }
    next();
  };
};

module.exports = {
  requireAdminAuth,
  requireRole,
  JWT_SECRET
};

