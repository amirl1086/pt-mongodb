const amqp = require('amqplib');
const config = require('config');

class RabbitMQ {
    #URL = `amqp://${config.remotes.rabbitmq.username}:${config.remotes.rabbitmq.password}@${config.remotes.rabbitmq.host}`;
    queueName = config.remotes.rabbitmq.queue;
    exchangeName = config.remotes.rabbitmq.exchange;
    key = config.remotes.rabbitmq.key
    connection = null;
    channel = null;


    async connect() {
        this.connection = await amqp.connect(this.#URL);
    }
    
    async createChannel() {
        console.log('connect createChannel: ', this.exchangeName);
        this.channel = await this.connection.createChannel();
        this.exchange = await this.channel.assertExchange(
            this.exchangeName,
            'direct',
            { durable: true }
        ).catch(console.error);
        const queueResponse = await this.channel.assertQueue(this.queueName, {durable: true});
    }
    
    async produce(data) {
        try {
            await this.connect();
            await this.createChannel();
            await this.publish(data);
            await this.close();
        } catch (err) {
            console.error(`error publishing message to ${this.queueName} with id ${data.id}`)
        }
    }

    async consume() {
        await this.channel.bindQueue(this.queue, this.exchangeName, this.key);
        this.channel.consume(this.queueName, function(msg) {
            console.log("msg ", msg);
        }, { noAck: false, consumerTag: 'main-db-consumer' });
    }

    async publish(data) {
        await this.channel.bindQueue(this.queueName, this.exchangeName, this.key);
        console.log('createChannel queueResponse: ', queueResponse);
        await this.channel.publish(
            this.exchangeName,
            this.queueName,
            Buffer.from(data)
        );
    }

    async close() {
        await this.channel.close();
        await this.connection.close();
    }

    getURL() {
        return this.#URL;
    }
}

module.exports = RabbitMQ;
