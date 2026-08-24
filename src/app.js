const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const logger = require('./config/logger');
const env = require('./config/env');
const errorHandler = require('./middlewares/errorHandler');
const ApiError = require('./utils/ApiError');
const baseRoutes = require('./routes/index');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');

const app = express();

app.use(helmet());
app.use(cors({ 
  origin: (origin, callback) => {
    const allowed = env.CORS_ORIGIN.split(',').map(o => o.trim());
    if (!origin || allowed.includes(origin) || env.CORS_ORIGIN === '*') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }, 
  credentials: true 
}));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use(cookieParser());
app.use(compression());

const morganFormat = env.NODE_ENV === 'development' ? 'dev' : 'combined';
app.use(morgan(morganFormat, {
  stream: { write: (message) => logger.info(message.trim()) }
}));

// Serve static files (uploads)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Swagger Documentation
const swaggerDocument = YAML.load(path.join(__dirname, 'docs', 'swagger.yaml'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use('/api', baseRoutes);

app.use((req, res, next) => {
  next(new ApiError(404, `Cannot find ${req.originalUrl} on this server!`));
});

app.use(errorHandler);

module.exports = app;
