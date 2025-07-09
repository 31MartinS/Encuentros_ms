import amqp from 'amqplib';
import dotenv from 'dotenv';

dotenv.config();

let channel = null;

export async function connectToRabbitMQ() {
  if (channel) return channel;

  const host = process.env.RABBITMQ_HOST || 'localhost';
  const port = process.env.RABBITMQ_PORT || '5672';
  const url = `amqp://${host}:${port}`;

  try {
    const connection = await amqp.connect(url);
    channel = await connection.createChannel();

    // Asegurar colas necesarias
    await channel.assertQueue('notificaciones', { durable: false });
    await channel.assertQueue('eventos', { durable: false });

    console.log('📡 Conectado a RabbitMQ');
    return channel;
  } catch (error) {
    console.error('❌ Error al conectar a RabbitMQ:', error);
    throw error;
  }
}

export async function publishEvent(queue, message) {
  if (!channel) await connectToRabbitMQ();

  const payload = Buffer.from(JSON.stringify(message));
  channel.sendToQueue(queue, payload);
}
