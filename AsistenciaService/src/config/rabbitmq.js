import amqp from 'amqplib';
import dotenv from 'dotenv';

dotenv.config();

let connection = null;
let channel = null;

const RETRY_INTERVAL_MS = 5000;

export const connectRabbitMQ = async () => {
  const amqpUrl = process.env.RABBITMQ_URL;

  if (!amqpUrl) {
    console.error('❌ RABBITMQ_URL no está definida.');
    process.exit(1);
  }

  try {
    connection = await amqp.connect(amqpUrl);
    channel = await connection.createChannel();

    connection.on('error', (err) => {
      console.error('🐰❌ Error de conexión a RabbitMQ:', err.message);
    });

    connection.on('close', () => {
      console.warn('🐰⚠️ Conexión a RabbitMQ cerrada. Reintentando...');
      setTimeout(connectRabbitMQ, RETRY_INTERVAL_MS);
    });

    console.log('✅ Conectado a RabbitMQ correctamente');
  } catch (err) {
    console.error('🐰❌ Fallo al conectar a RabbitMQ:', err.message);
    setTimeout(connectRabbitMQ, RETRY_INTERVAL_MS);
  }
};

export const publishToQueue = async (queueName, message) => {
  if (!channel) {
    console.error('🐰❌ Canal de RabbitMQ no disponible');
    return;
  }

  try {
    await channel.assertQueue(queueName, { durable: true });
    channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)));
    console.log(`📤 Evento enviado a la cola [${queueName}]:`, message);
  } catch (err) {
    console.error('🐰❌ Error al publicar en RabbitMQ:', err.message);
  }
};
