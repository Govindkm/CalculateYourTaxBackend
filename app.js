const express = require('express');
const app = express();
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const errorHandler = require('./Middlewares/error');

const swaggerDocument = require('./swagger.json');
const logger = require('./Middlewares/logging');

// Config
if (process.env.NODE_ENV !== "PRODUCTION") {
    logger.info("Development Mode Activated");
}

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

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
  res.send('Your API is working!');
});

app.use(errorHandler);

app.listen(3000, () => {
  logger.info('Server started on port 3000');
});
