import amqp from 'amqplib';

const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://admin:admin@rabbitmq:5672';

let channel: amqp.Channel;

export async function connectRabbitMQ() {
  try {
    const connection = await amqp.connect(RABBITMQ_URL);
    channel = await connection.createChannel();
    console.log('🟢 Conectado a RabbitMQ');

    // Asegura que la cola exista
    await channel.assertQueue('notificaciones', { durable: true });

    return channel;
  } catch (error) {
    console.error('🔴 Error al conectar con RabbitMQ:', error);
    process.exit(1);
  }
}

export function getChannel(): amqp.Channel {
  if (!channel) {
    throw new Error('❌ Canal de RabbitMQ no inicializado');
  }
  return channel;
}
