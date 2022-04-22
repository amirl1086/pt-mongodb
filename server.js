
const express = require("express");
const crypto = require("crypto");
const cors = require("cors");
const app = express();

const amqplib = require('amqplib');
const config = require('config');

const RabbitMQ = require('./lib/rabbitmq');
const mongodb = require('./lib/db');
const routes = require('./lib/routes');

// middlewares
app.use(express.json()); // parse requests of content-type - application/json
app.use((req, res, next) => {
    console.log('server middleware ', req.headers);
    next();
});
app.use('/api', routes);
app.use((err, req, res, next) => {
    // console.log('error handler middleware');
    console.error('middleware error: ', err);
    res.status(err.statusCode).send(err.message);
});

// server startup
(async () => {
    try {
        const rabbitmqClient = new RabbitMQ();
        await rabbitmqClient.connect('Consume');
    } catch (err) {
        console.error('error starting server: ', err);
        process.exit(1);
    }
    
    process.once('SIGINT', async () => {
        console.log('received SIGINT, closing connection');
        await rabbitmqClient.close();
        process.exit(0);
    });
})();
