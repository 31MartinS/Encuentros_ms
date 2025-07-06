import amqp from 'amqplib';

export let channel: amqp.Channel;

(async () => {
  try {
    const connection = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://localhost');
    channel = await connection.createChannel();
    await channel.assertQueue('notificaciones');
    console.log('📡 Conectado a RabbitMQ');
  } catch (err) {
    console.error('❌ Error conectando a RabbitMQ', err);
  }
})();
