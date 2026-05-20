/**
 * User Routes
 */
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { requireAuth, requireAdmin, requireMasterAdmin } = require('../middlewares/auth');

// Public
router.post('/register', userController.register);
router.post('/login', userController.login);

// Authenticated
router.get('/profile', requireAuth, userController.getProfile);
router.post('/balance', requireAuth, userController.addBalance);

// Admin
router.get('/', requireAdmin, userController.getAll);

// Master Admin
router.post('/create-admin', requireMasterAdmin, userController.createAdmin);

module.exports = router;
