const amqplib = require('amqplib');
const config = require('config');

const RabbitMQ = require('./lib/rabbitmq');
const initDB = require('./lib/initDB')


async function processMessage(msg) {
    console.log(msg.content.toString(), 'Call email API here');
    //call your email service here to send the email
}

process.once('SIGINT', async () => {
    console.log('got sigint, closing connection');
    // await channel.close();
    // await connection.close();
    process.exit(0);
});


(async () => {
    await initDB();

    const rabbitmqClient = new RabbitMQ();
    await rabbitmqClient.connect();
    // const channel = await connection.createChannel();
    await rabbitmqClient.createChannel();
    await rabbitmqClient.consume();

    console.log('waiting for messages, to exit press Ctrl+C');

    process.once('SIGINT', async () => {
        console.log('got sigint, closing connection');
        await rabbitmqClient.close();
        process.exit(0);
    });
})();