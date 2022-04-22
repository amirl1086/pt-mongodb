const amqp = require('amqplib');
const config = require('config');

class RabbitMQ {
    constructor() {
        this.URL = `amqp://${config.remotes.rabbitmq.username}:${config.remotes.rabbitmq.password}@${config.remotes.rabbitmq.host}`;
        this.queueName = config.remotes.rabbitmq.queueName;
        this.exchangeName = config.remotes.rabbitmq.exchangeName;
        this.key = config.remotes.rabbitmq.key;
        this.consumerTag = config.remotes.rabbitmq.consumerTag;
        this.exchangeStrategy = config.remotes.rabbitmq.exchangeStrategy;
        this.connection = null;
        this.channel = null;
    }

    async connect(queueEnd) {
        this.connection = await amqp.connect(this.URL);
        const exchangeFunctionName = `${this.exchangeStrategy}${queueEnd}`;
        await this[exchangeFunctionName]();
    }

    async setupChannel () {
        this.channel = await this.connection.createChannel(); 
        await this.channel.assertExchange(this.exchangeName, this.exchangeStrategy);
        await this.channel.assertQueue(this.queueName);
        this.channel.bindQueue(this.queueName, this.exchangeName, this.key);
    }

    async fanoutPublish(data) {
        this.channel = await this.connection.createChannel();
        this.exchange = this.channel.assertExchange(this.exchangeName, this.exchangeStrategy, {durable: false});
        this.channel.publish(this.exchangeName, this.queueName, Buffer.from(JSON.stringify(data)));
    }

    async fanoutConsume() {
        await this.setupChannel();
        this.channel.consume(rabbitQueue.queue, function(data) { // TODO - fix bug rabbitQueue
            console.log('fanoutConsume data: ', data);
        }, { noAck: true, consumerTag: config.remotes.rabbitmq.consumerTag });
        console.log('waiting for messages');
    }

    async directPublish(data) {
        this.setupChannel();
        this.channel.sendToQueue(this.queueName, Buffer.from(JSON.stringify(data)))
    }

    async directConsume() {
        this.channel = await this.connection.createChannel();
        this.channel.consume(this.queueName, (message)=>{
            const data = JSON.parse(message.content);
            this.channel.ack(message);
            console.log('directConsume data: ', data);
        })
    }

    close() {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                this.connection.close();
                console.log('closed rabbitmq connection');
                resolve();
            }, 500);
        })
    }
}

module.exports = RabbitMQ;
