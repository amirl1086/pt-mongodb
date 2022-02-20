const amqp = require('amqplib');
const config = require('config');

class RabbitMQ {
    #URL = `amqp://${config.remotes.rabbitmq.username}:${config.remotes.rabbitmq.password}@${config.remotes.rabbitmq.host}`;
    queue = config.remotes.rabbitmq.queue;
    exchange = config.remotes.rabbitmq.exchange;
    key = config.remotes.rabbitmq.key
    connection = null;
    channel = null;


    async connect() {
        this.connection = await amqp.connect(this.#URL);
    }
    
    async createChannel() {
        console.log('connect createChannel: ', this.exchange);
        this.channel = await this.connection.createChannel();
        this.exchange = await this.channel.assertExchange(
            this.exchange,
            'direct',
            { durable: true }
        ).catch(console.error);
        const queueResponse = await this.channel.assertQueue(this.queue, {durable: true});
        // const bindResponse = await this.channel.bindQueue(this.queue, this.exchange, this.key);
        console.log('createChannel queueResponse: ', queueResponse);
    }
    
    async produce(data) {
        try {
            await this.connect();
            await this.createChannel();
            await this.publish(data);
            await this.close();
        } catch (err) {
            console.error(`error publishing message to ${this.queue} with id ${data.id}`)
        }
    }

    async consume() {
        // await this.channel.bindQueue(this.queue, this.exchange, this.key);
        this.channel.consume(this.queue, function(msg) {
            console.log("msg ", msg);
        }, { noAck: false, consumerTag: 'main-db-consumer' });
    }

    async publish(data) {
        await this.channel.publish(
            this.exchange,
            this.queue,
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
