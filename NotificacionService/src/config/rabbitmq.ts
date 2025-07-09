import amqp from 'amqplib';
import { handleNotificacion } from '../consumers/notificacion.consumer';

const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://admin:admin@rabbitmq:5672';

export async function connectRabbitMQ() {
  try {
    const connection = await amqp.connect(RABBITMQ_URL);
    const channel = await connection.createChannel();

    const queue = 'notificaciones';
    await channel.assertQueue(queue, { durable: true });

    console.log('🟢 Esperando mensajes en la cola "notificaciones"...');

    channel.consume(queue, async (msg) => {
      if (msg) {
        const data = JSON.parse(msg.content.toString());
        await handleNotificacion(data);
        channel.ack(msg);
      }
    });
  } catch (error) {
    console.error('🔴 Error en RabbitMQ:', error);
    process.exit(1);
  }
}
