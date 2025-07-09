// src/consumers/rabbitConsumer.js

import amqp from 'amqplib';
import dotenv from 'dotenv';

dotenv.config();

const QUEUE_NAME = 'notificaciones';

export async function setupRabbitMQConsumer(io) {
  try {
    const connection = await amqp.connect(process.env.RABBITMQ_URL);
    const channel = await connection.createChannel();

    await channel.assertQueue(QUEUE_NAME, { durable: false });
    console.log(`📥 Esperando mensajes en la cola "${QUEUE_NAME}"...`);

    channel.consume(QUEUE_NAME, (msg) => {
      if (msg !== null) {
        const contenido = msg.content.toString();
        console.log(`📨 Mensaje recibido: ${contenido}`);

        // Emitir a todos los clientes conectados (puedes usar rooms también)
        io.emit('nueva-notificacion', JSON.parse(contenido));

        channel.ack(msg);
      }
    });
  } catch (error) {
    console.error('❌ Error al conectar con RabbitMQ:', error);
  }
}
