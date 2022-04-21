const amqplib = require('amqplib');
const config = require('config');

const RabbitMQ = require('./lib/rabbitmq');
const mongodb = require('./lib/db');


(async () => {
    await mongodb.initDB();

    const rabbitmqClient = new RabbitMQ();
    await rabbitmqClient.connect();
    const exchangeFunctionName = `${config.remotes.rabbitmq.exchangeStrategy}Consume`;
    await rabbitmqClient[exchangeFunctionName]();

    console.log('waiting for messages');

    process.once('SIGINT', async () => {
        console.log('received SIGINT, closing connection');
        await rabbitmqClient.close();
        process.exit(0);
    });
})();
