// src/utils/rabbitSender.js

import amqp from 'amqplib';

let channel = null;

export async function connectToRabbit() {
  if (channel) return channel;

  const connection = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://localhost');
  channel = await connection.createChannel();
  await channel.assertQueue('notificaciones', { durable: false });

  return channel;
}

export async function enviarNotificacion(notificacion) {
  const ch = await connectToRabbit();
  ch.sendToQueue('notificaciones', Buffer.from(JSON.stringify(notificacion)));
}
