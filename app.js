const express = require('express');
const app = express();
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const errorHandler = require('./Middlewares/error');
const dotenv = require('dotenv');
dotenv.config();

const port = process.env.PORT || 3000;


const swaggerDocument = require('./swagger.json');
const logger = require('./Middlewares/logging');

// Config
if (process.env.NODE_ENV !== "PRODUCTION") {
    logger.info("Development Mode Activated");
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
    logger.info("Swagger UI is running on /api-docs");
}

const corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Logging Incoming Requests
app.use((req, res, next) => {
    logger.info(`${req.method} ${req.originalUrl} ${JSON.stringify(req.body)}`);
    next();
  });

// Routes
app.use('/api/calculation', require('./Controllers/CalculationController'));

app.get('/', (req, res) => {
  if(process.env.NODE_ENV !== "PRODUCTION") {
    res.redirect('/api-docs');
  } else {
    res.send('It works! Please refer to the documentation for more information.');
  }
});

app.use(errorHandler);

app.listen(port, () => {
  logger.info('Server is running on port ' + port + '...');
});

module.exports = app;
