const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'CarGallery API',
      version: '1.0.0',
      description: 'Car Rental System REST API Documentation',
      contact: {
        name: 'CarGallery',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
    ],
    tags: [
      { name: 'Categories', description: 'Category management operations' },
      { name: 'Vehicles', description: 'Vehicle management operations' },
      { name: 'Reservations', description: 'Reservation management operations' },
    ],
  },
  apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
