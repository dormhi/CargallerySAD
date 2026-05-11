/**
 * Reservation Routes
 * Defines HTTP endpoints for reservation operations
 */
const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservationController');
const validate = require('../middlewares/validate');
const {
  createReservationSchema,
  updateStatusSchema,
} = require('../validations/reservationValidation');

/**
 * @swagger
 * components:
 *   schemas:
 *     Reservation:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         vehicleId:
 *           type: integer
 *           example: 3
 *         customerName:
 *           type: string
 *           example: "John Doe"
 *         customerPhone:
 *           type: string
 *           example: "+90 555 123 4567"
 *         startDate:
 *           type: string
 *           format: date
 *           example: "2026-06-01"
 *         endDate:
 *           type: string
 *           format: date
 *           example: "2026-06-05"
 *         totalPrice:
 *           type: number
 *           example: 300.00
 *         status:
 *           type: string
 *           enum: [pending, approved, cancelled]
 *         vehicle:
 *           $ref: '#/components/schemas/Vehicle'
 *         createdAt:
 *           type: string
 *           format: date-time
 *     ReservationInput:
 *       type: object
 *       required:
 *         - vehicleId
 *         - customerName
 *         - customerPhone
 *         - startDate
 *         - endDate
 *       properties:
 *         vehicleId:
 *           type: integer
 *           example: 3
 *         customerName:
 *           type: string
 *           example: "John Doe"
 *         customerPhone:
 *           type: string
 *           example: "+90 555 123 4567"
 *         startDate:
 *           type: string
 *           format: date
 *           example: "2026-06-01"
 *         endDate:
 *           type: string
 *           format: date
 *           example: "2026-06-05"
 *     StatusInput:
 *       type: object
 *       required:
 *         - status
 *       properties:
 *         status:
 *           type: string
 *           enum: [pending, approved, cancelled]
 *           example: "approved"
 */

/**
 * @swagger
 * /api/reservations:
 *   get:
 *     summary: Get all reservations
 *     tags: [Reservations]
 *     responses:
 *       200:
 *         description: List of reservations
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
 *                     $ref: '#/components/schemas/Reservation'
 *                 count:
 *                   type: integer
 */
router.get('/', reservationController.getAll);

/**
 * @swagger
 * /api/reservations/{id}:
 *   get:
 *     summary: Get a reservation by ID
 *     tags: [Reservations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Reservation details
 *       404:
 *         description: Reservation not found
 */
router.get('/:id', reservationController.getById);

/**
 * @swagger
 * /api/reservations:
 *   post:
 *     summary: Create a new reservation
 *     description: Creates a reservation with automatic total price calculation. Checks for date conflicts and vehicle availability.
 *     tags: [Reservations]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ReservationInput'
 *     responses:
 *       201:
 *         description: Reservation created
 *       400:
 *         description: Validation error or vehicle unavailable
 *       404:
 *         description: Vehicle not found
 *       409:
 *         description: Date conflict with existing reservation
 */
router.post('/', validate(createReservationSchema), reservationController.create);

/**
 * @swagger
 * /api/reservations/{id}/status:
 *   patch:
 *     summary: Update reservation status
 *     tags: [Reservations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/StatusInput'
 *     responses:
 *       200:
 *         description: Status updated
 *       404:
 *         description: Reservation not found
 */
router.patch('/:id/status', validate(updateStatusSchema), reservationController.updateStatus);

/**
 * @swagger
 * /api/reservations/{id}:
 *   delete:
 *     summary: Delete a reservation
 *     tags: [Reservations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Reservation deleted
 *       404:
 *         description: Reservation not found
 */
router.delete('/:id', reservationController.delete);

module.exports = router;
