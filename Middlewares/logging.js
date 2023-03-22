const winston = require('winston');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config();
const DailyRotateFile = require('winston-daily-rotate-file');

const dailyRotateFileTransport = new DailyRotateFile({
    filename: '%DATE%.log',
    dirname:  process.env.LOG_PATH,
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d'
  });

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.printf(info => `${info.timestamp} ${info.level}: ${info.message} ${info.stack ? info.stack : ''}`)
    ),
    transports: [
        dailyRotateFileTransport
    ]
});


if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.simple(),
    }));
}




module.exports = logger;
