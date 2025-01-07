// src/config/swagger.js
const swaggerJsdoc = require('swagger-jsdoc');
const path = require('path');

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Documentation',
      version: '1.0.0',
      description: 'API Documentation'
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 3000}`
      }
    ],
    security: [{
      bearerAuth: []
    }]
  },
  apis: [
    path.join(__dirname, '../router/api/*.js'),
    path.join(__dirname, '../router/api/index.js')
  ]
};

module.exports = swaggerJsdoc(swaggerOptions);