import amqp from 'amqplib';

const RABBITMQ_URL = process.env.RABBITMQ_URL || '';
let channel: amqp.Channel;

export async function connectRabbitMQ() {
  try {
    const connection = await amqp.connect(RABBITMQ_URL);
    channel = await connection.createChannel();
    await channel.assertQueue('notificaciones', { durable: true });
    console.log('📡 Conectado a RabbitMQ');
  } catch (error) {
    console.error('❌ Error conectando a RabbitMQ:', error);
  }
}

export function getChannel(): amqp.Channel {
  if (!channel) throw new Error('El canal de RabbitMQ no está inicializado');
  return channel;
}
