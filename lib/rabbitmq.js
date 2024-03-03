const amqp = require('amqplib');

class RabbitMQ {
    constructor() {
        this.connection = null;
        this.channel = null;
    }

    async connect() {
        try {
            this.connection = await amqp.connect('amqp://localhost');
            this.channel = await this.connection.createChannel();
        } catch (error) {
            console.error('Erreur lors de la connexion à RabbitMQ :', error);
        }
    }

    async sendToQueue(queue, message) {
        await this.channel.assertQueue(queue);
        this.channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
    }

    async consumeFromQueue(queue, callback) {
        await this.channel.assertQueue(queue);
        this.channel.consume(queue, async (msg) => {
            if (msg !== null) {
                const message = JSON.parse(msg.content.toString());
                try {
                    await callback(message, async () => {
                        this.channel.ack(msg);
                    });
                } catch (error) {
                    console.error('Erreur lors du traitement du message :', error);
                }
            }
        });
    }

}

module.exports = new RabbitMQ();
