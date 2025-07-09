import amqp from 'amqplib';

let channel = null;

export async function connectToRabbit() {
  if (channel) return channel;

  const host = process.env.RABBITMQ_HOST || 'localhost';
  const port = process.env.RABBITMQ_PORT || '5672';
  const url = `amqp://${host}:${port}`;

  const connection = await amqp.connect(url);
  channel = await connection.createChannel();
  await channel.assertQueue('notificaciones', { durable: false });

  return channel;
}

export async function enviarNotificacion(notificacion) {
  const ch = await connectToRabbit();
  ch.sendToQueue('notificaciones', Buffer.from(JSON.stringify(notificacion)));
}
