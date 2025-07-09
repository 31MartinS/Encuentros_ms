// src/controllers/notificationController.js

import amqp from 'amqplib';
import { crearNotificacion } from '../models/notificationModel.js';
import dotenv from 'dotenv';

dotenv.config();

const QUEUE_NAME = 'notificaciones';
let channel = null;

// Conexión a RabbitMQ una sola vez
async function connectToRabbit() {
  if (!channel) {
    const connection = await amqp.connect(process.env.RABBITMQ_URL);
    channel = await connection.createChannel();
    await channel.assertQueue(QUEUE_NAME, { durable: false });
  }
}

/**
 * Controlador REST POST /notificaciones
 * Recibe una notificación, la valida y la publica en la cola de RabbitMQ
 */
export async function enviarNotificacion(req, res) {
  try {
    await connectToRabbit();
    const notificacion = crearNotificacion(req.body);

    channel.sendToQueue(QUEUE_NAME, Buffer.from(JSON.stringify(notificacion)));
    console.log('📤 Notificación publicada en RabbitMQ:', notificacion);

    res.status(200).json({
      mensaje: 'Notificación enviada correctamente',
      data: notificacion
    });

  } catch (error) {
    console.error('❌ Error al enviar notificación:', error.message);
    res.status(400).json({ error: error.message });
  }
}
