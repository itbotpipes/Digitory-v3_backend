const winston = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');
const env = require('./env');
const path = require('path');

const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json()
);

const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`
  )
);

const logger = winston.createLogger({
  level: env.NODE_ENV === 'development' ? 'debug' : 'info',
  format: logFormat,
  transports: [
    new DailyRotateFile({
      dirname: path.join(__dirname, '../../logs'),
      filename: 'error-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      level: 'error',
      maxFiles: '14d',
    }),
    new DailyRotateFile({
      dirname: path.join(__dirname, '../../logs'),
      filename: 'combined-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      maxFiles: '14d',
    }),
  ],
});

logger.add(
  new winston.transports.Console({
    format: env.NODE_ENV === 'development' ? consoleFormat : consoleFormat,
  })
);

module.exports = logger;
