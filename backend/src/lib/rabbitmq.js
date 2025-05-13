import amqp from 'amqplib';

const connect = async () => {
    try {
        const connection = await amqp.connect('amqp://rabbitmq');
        const channel = await connection.createChannel();
        return channel;
    } catch (error) {
        console.error("RabbitMQ Connection Error:", error);
        throw error;
    }
};

export const publishMessage = async (queue, message) => {
    if (process.env.NODE_ENV === 'test') {
    return;
  }
    try {
        const channel = await connect();
        await channel.assertQueue(queue);
        channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), { persistent: true });
        console.log(`[x] Sent '${JSON.stringify(message)}' to queue`);
    } catch (error) {
        console.error("RabbitMQ Publish Error:", error);
        throw error;
    }
};

export const consumeMessages = async (queue, callback) => {
    try {
        const channel = await connect();
        await channel.assertQueue(queue, { durable: true });
        channel.prefetch(1);
        channel.consume(queue, (msg) => {
            if (msg !== null) {
                try {
                    callback(JSON.parse(msg.content.toString()));
                    channel.ack(msg);
                } catch (error) {
                    console.error("RabbitMQ Consume Callback Error:", error);
                    channel.nack(msg, false, true);
                }
            }
        }, { noAck: false, consumerTag: 'myConsumerTag' });
        console.log(`[*] Waiting for messages in queue '${queue}'`);
    } catch (error) {
        console.error("RabbitMQ Consume Error:", error);
        throw error;
    }
};