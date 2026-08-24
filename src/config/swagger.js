const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const path = require('path');
const logger = require('./logger');

let swaggerDocument;
try {
  // In a real app, you would have a swagger.yaml file in docs/
  // For initialization, we will just prepare the structure
  swaggerDocument = {
    openapi: '3.0.0',
    info: {
      title: 'Digitory CMS API',
      version: '1.0.0',
    },
    paths: {
      '/health': {
        get: {
          summary: 'Health check',
          responses: {
            200: {
              description: 'OK'
            }
          }
        }
      }
    }
  };
} catch (error) {
  logger.warn(`Could not load swagger.yaml: ${error.message}`);
}

const setupSwagger = (app) => {
  if (swaggerDocument) {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  }
};

module.exports = setupSwagger;
