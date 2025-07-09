import amqp from 'amqplib';

const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://rabbitmq:5672';

let channel: amqp.Channel;

export async function connectRabbitMQ() {
  try {
    const connection = await amqp.connect(RABBITMQ_URL);
    channel = await connection.createChannel();
    await channel.assertQueue('notificaciones', { durable: true });
    console.log('📡 Conectado a RabbitMQ');
  } catch (error) {
    console.error('❌ Error en RabbitMQ:', error);
  }
}

export async function enviarNotificacion(notificacion: any) {
  if (!channel) throw new Error('RabbitMQ no está conectado');
  channel.sendToQueue('notificaciones', Buffer.from(JSON.stringify(notificacion)));
}
