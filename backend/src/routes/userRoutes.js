/**
 * User Routes
 * Defines HTTP endpoints for user operations
 */
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const validate = require('../middlewares/validate');
const { requireAuth, requireAdmin, requireMasterAdmin } = require('../middlewares/auth');
const { registerSchema, loginSchema, addBalanceSchema, createAdminSchema } = require('../validations/userValidation');

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         name:
 *           type: string
 *           example: "John Doe"
 *         email:
 *           type: string
 *           format: email
 *           example: "john@example.com"
 *         phone:
 *           type: string
 *           example: "+90 555 123 4567"
 *         balance:
 *           type: number
 *           example: 10000.00
 *         role:
 *           type: string
 *           enum: [user, admin, master_admin]
 *           example: "user"
 *         createdAt:
 *           type: string
 *           format: date-time
 *     RegisterInput:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *       properties:
 *         name:
 *           type: string
 *           example: "John Doe"
 *         email:
 *           type: string
 *           format: email
 *           example: "john@example.com"
 *         phone:
 *           type: string
 *           example: "+90 555 123 4567"
 *         password:
 *           type: string
 *           minLength: 4
 *           example: "securepassword"
 *     LoginInput:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: "john@example.com"
 *         password:
 *           type: string
 *           example: "securepassword"
 */

/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterInput'
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Validation error
 *       409:
 *         description: Email is already registered
 */
router.post('/register', validate(registerSchema), userController.register);

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Login with email and password
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginInput'
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Invalid email or password
 */
router.post('/login', validate(loginSchema), userController.login);

/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     summary: Get current user profile
 *     tags: [Users]
 *     parameters:
 *       - in: header
 *         name: X-User-Id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Authenticated user ID
 *     responses:
 *       200:
 *         description: User profile
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Authentication required
 *       404:
 *         description: User not found
 */
router.get('/profile', requireAuth, userController.getProfile);

/**
 * @swagger
 * /api/users/balance:
 *   post:
 *     summary: Add balance to current user account
 *     tags: [Users]
 *     parameters:
 *       - in: header
 *         name: X-User-Id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Authenticated user ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amount
 *             properties:
 *               amount:
 *                 type: number
 *                 example: 500.00
 *                 description: Amount to add (must be positive)
 *     responses:
 *       200:
 *         description: Balance updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Invalid amount
 *       401:
 *         description: Authentication required
 */
router.post('/balance', requireAuth, validate(addBalanceSchema), userController.addBalance);

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users (admin only)
 *     tags: [Users]
 *     parameters:
 *       - in: header
 *         name: X-User-Id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Admin user ID
 *     responses:
 *       200:
 *         description: List of users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *                 count:
 *                   type: integer
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Admin access required
 */
router.get('/', requireAdmin, userController.getAll);

/**
 * @swagger
 * /api/users/create-admin:
 *   post:
 *     summary: Create a new admin account (master admin only)
 *     tags: [Users]
 *     parameters:
 *       - in: header
 *         name: X-User-Id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Master admin user ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Admin User"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "admin@example.com"
 *               password:
 *                 type: string
 *                 minLength: 4
 *                 example: "adminpassword"
 *     responses:
 *       201:
 *         description: Admin created
 *       400:
 *         description: Validation error
 *       403:
 *         description: Master admin access required
 *       409:
 *         description: Email is already taken
 */
router.post('/create-admin', requireMasterAdmin, validate(createAdminSchema), userController.createAdmin);

module.exports = router;
