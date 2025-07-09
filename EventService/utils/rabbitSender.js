const amqp = require("amqplib");

let channel = null;

async function connectToRabbit() {
  if (channel) return channel;

  const host = process.env.RABBITMQ_HOST || "rabbitmq";
  const port = process.env.RABBITMQ_PORT || "5672";
  const url = `amqp://${host}:${port}`;

  try {
    const connection = await amqp.connect(url);
    channel = await connection.createChannel();
    await channel.assertQueue("notificaciones", { durable: false });
    console.log("🟢 Conectado a RabbitMQ");
    return channel;
  } catch (err) {
    console.error("🔴 Error conectando a RabbitMQ:", err.message);
    throw err;
  }
}

async function enviarNotificacion(notificacion) {
  const ch = await connectToRabbit();
  const buffer = Buffer.from(JSON.stringify(notificacion));
  ch.sendToQueue("notificaciones", buffer);
  console.log("📨 Notificación enviada:", notificacion);
}

module.exports = {
  enviarNotificacion,
};
