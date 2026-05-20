/**
 * Auth Middleware
 * Simple user identification via X-User-Id header
 */
const prisma = require('../config/database');

/**
 * Attach user to request if X-User-Id header exists
 */
async function auth(req, res, next) {
  const userId = req.headers['x-user-id'];
  if (userId) {
    try {
      const user = await prisma.user.findUnique({ where: { id: Number(userId) } });
      if (user) {
        req.user = user;
      }
    } catch (e) {
      // ignore
    }
  }
  next();
}

/**
 * Require authenticated user
 */
function requireAuth(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ success: false, error: { message: 'Authentication required' } });
  }
  next();
}

/**
 * Require admin or master_admin role
 */
function requireAdmin(req, res, next) {
  if (!req.user || (req.user.role !== 'admin' && req.user.role !== 'master_admin')) {
    return res.status(403).json({ success: false, error: { message: 'Admin access required' } });
  }
  next();
}

/**
 * Require master_admin role
 */
function requireMasterAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'master_admin') {
    return res.status(403).json({ success: false, error: { message: 'Master admin access required' } });
  }
  next();
}

module.exports = { auth, requireAuth, requireAdmin, requireMasterAdmin };
