/**
 * Vehicle Routes
 * Defines HTTP endpoints for vehicle operations
 */
const express = require('express');
const router = express.Router();
const vehicleController = require('../controllers/vehicleController');
const validate = require('../middlewares/validate');
const { createVehicleSchema, updateVehicleSchema } = require('../validations/vehicleValidation');

/**
 * @swagger
 * components:
 *   schemas:
 *     Vehicle:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         brand:
 *           type: string
 *           example: "Toyota"
 *         model:
 *           type: string
 *           example: "Corolla"
 *         year:
 *           type: integer
 *           example: 2024
 *         pricePerDay:
 *           type: number
 *           example: 75.00
 *         fuelType:
 *           type: string
 *           enum: [Gasoline, Diesel, Electric, Hybrid]
 *         transmission:
 *           type: string
 *           enum: [Automatic, Manual]
 *         mileage:
 *           type: integer
 *           example: 15000
 *         imageUrl:
 *           type: string
 *           nullable: true
 *         available:
 *           type: boolean
 *         categoryId:
 *           type: integer
 *         category:
 *           $ref: '#/components/schemas/Category'
 *         createdAt:
 *           type: string
 *           format: date-time
 *     VehicleInput:
 *       type: object
 *       required:
 *         - brand
 *         - model
 *         - year
 *         - pricePerDay
 *         - fuelType
 *         - transmission
 *         - mileage
 *         - categoryId
 *       properties:
 *         brand:
 *           type: string
 *           example: "Toyota"
 *         model:
 *           type: string
 *           example: "Corolla"
 *         year:
 *           type: integer
 *           example: 2024
 *         pricePerDay:
 *           type: number
 *           example: 75.00
 *         fuelType:
 *           type: string
 *           enum: [Gasoline, Diesel, Electric, Hybrid]
 *         transmission:
 *           type: string
 *           enum: [Automatic, Manual]
 *         mileage:
 *           type: integer
 *           example: 15000
 *         imageUrl:
 *           type: string
 *           example: "https://example.com/car.jpg"
 *         available:
 *           type: boolean
 *           default: true
 *         categoryId:
 *           type: integer
 *           example: 1
 */

/**
 * @swagger
 * /api/vehicles:
 *   get:
 *     summary: Get all vehicles with optional filters
 *     tags: [Vehicles]
 *     parameters:
 *       - in: query
 *         name: brand
 *         schema:
 *           type: string
 *         description: Filter by brand (partial match)
 *       - in: query
 *         name: categoryId
 *         schema:
 *           type: integer
 *         description: Filter by category ID
 *       - in: query
 *         name: fuelType
 *         schema:
 *           type: string
 *           enum: [Gasoline, Diesel, Electric, Hybrid]
 *       - in: query
 *         name: transmission
 *         schema:
 *           type: string
 *           enum: [Automatic, Manual]
 *       - in: query
 *         name: available
 *         schema:
 *           type: boolean
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search in brand and model
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [pricePerDay, year, mileage, createdAt]
 *         description: Sort field
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: Sort order
 *     responses:
 *       200:
 *         description: List of vehicles
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
 *                     $ref: '#/components/schemas/Vehicle'
 *                 count:
 *                   type: integer
 */
router.get('/', vehicleController.getAll);

/**
 * @swagger
 * /api/vehicles/{id}:
 *   get:
 *     summary: Get a vehicle by ID with reservations
 *     tags: [Vehicles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Vehicle details with reservations
 *       404:
 *         description: Vehicle not found
 */
router.get('/:id', vehicleController.getById);

/**
 * @swagger
 * /api/vehicles:
 *   post:
 *     summary: Create a new vehicle
 *     tags: [Vehicles]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/VehicleInput'
 *     responses:
 *       201:
 *         description: Vehicle created
 *       400:
 *         description: Validation error or invalid category
 */
router.post('/', validate(createVehicleSchema), vehicleController.create);

/**
 * @swagger
 * /api/vehicles/{id}:
 *   put:
 *     summary: Update a vehicle
 *     tags: [Vehicles]
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
 *             $ref: '#/components/schemas/VehicleInput'
 *     responses:
 *       200:
 *         description: Vehicle updated
 *       404:
 *         description: Vehicle not found
 */
router.put('/:id', validate(updateVehicleSchema), vehicleController.update);

/**
 * @swagger
 * /api/vehicles/{id}:
 *   delete:
 *     summary: Delete a vehicle
 *     tags: [Vehicles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Vehicle deleted
 *       404:
 *         description: Vehicle not found
 *       409:
 *         description: Vehicle has active reservations
 */
router.delete('/:id', vehicleController.delete);

module.exports = router;
