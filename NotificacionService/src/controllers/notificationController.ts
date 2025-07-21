import { Request, Response } from 'express';
import * as amqp from 'amqplib/callback_api';
import dotenv from 'dotenv';
import { crearNotificacion, Notificacion } from '../models/notificationModel';

dotenv.config();

const QUEUE_NAME = 'notificaciones';
let channel: amqp.Channel | null = null;
let connection: amqp.Connection | null = null;

// Manejo de conexión mejorado con reconexión automática
function setupRabbitMQ(callback: (err: Error | null, channel?: amqp.Channel) => void): void {
  if (channel) return callback(null, channel);

  amqp.connect(process.env.RABBITMQ_URL || 'amqp://localhost', (connectErr, conn) => {
    if (connectErr) {
      console.error('❌ Error de conexión RabbitMQ:', connectErr.message);
      return callback(connectErr);
    }

    connection = conn;
    console.log('✅ Conexión RabbitMQ establecida');

    // Manejo de eventos de conexión
    connection.on('close', () => {
      console.log('🔄 Conexión RabbitMQ cerrada, intentando reconectar...');
      setTimeout(() => setupRabbitMQ(callback), 5000);
    });

    connection.on('error', (err) => {
      console.error('⚠️ Error en conexión RabbitMQ:', err.message);
    });

    connection.createChannel((channelErr, ch) => {
      if (channelErr) {
        console.error('❌ Error al crear canal:', channelErr.message);
        return callback(channelErr);
      }

      channel = ch;
      channel.assertQueue(QUEUE_NAME, { durable: true }, (assertErr) => {
        if (assertErr) {
          console.error('❌ Error al crear cola:', assertErr.message);
          return callback(assertErr);
        }

        console.log(`📭 Cola ${QUEUE_NAME} lista para recibir mensajes`);
        callback(null, channel!);
      });
    });
  });
}

export function enviarNotificacion(req: Request, res: Response): void {
  try {
    // Validación y creación de notificación
    const notificacion = crearNotificacion(req.body);
    
    setupRabbitMQ((err, ch) => {
      if (err) {
        console.error('❌ Error en setup RabbitMQ:', err.message);
        return res.status(503).json({ 
          error: 'Service Unavailable',
          message: 'Error al conectar con el servicio de mensajería',
          details: err.message
        });
      }

      if (!ch) {
        return res.status(500).json({
          error: 'Internal Server Error',
          message: 'Canal no disponible'
        });
      }

      const sent = ch.sendToQueue(
        QUEUE_NAME,
        Buffer.from(JSON.stringify(notificacion)),
        { persistent: true }
      );

      if (!sent) {
        console.error('❌ Error al publicar: El mensaje no pudo ser enviado a la cola');
        return res.status(500).json({
          error: 'Messaging Error',
          message: 'Error al enviar notificación'
        });
      }

      console.log('📤 Notificación enviada:', {
        tipo: notificacion.tipo,
        destino: notificacion.destino,
        timestamp: notificacion.timestamp
      });

      res.status(202).json({
        status: 'accepted',
        message: 'Notificación en proceso de entrega',
        notification: notificacion,
        queue: QUEUE_NAME,
        timestamp: new Date().toISOString()
      });
    });
  } catch (error: unknown) {
    const err = error instanceof Error ? error : new Error(String(error));
    console.error('⚠️ Error de validación:', err.message);
    
    res.status(400).json({
      error: 'Bad Request',
      message: 'Datos de notificación inválidos',
      details: err.message
    });
  }
}

// Cierre seguro de conexiones
export function gracefulShutdown(callback?: (err?: Error) => void): void {
  const finalCallback = callback || ((err) => {
    if (err) console.error('❌ Error al cerrar:', err.message);
    else console.log('🛑 Conexiones RabbitMQ cerradas correctamente');
  });

  if (!channel && !connection) return finalCallback();

  const closeChannel = (cb: () => void) => {
    if (!channel) return cb();
    
    channel.close((err) => {
      if (err) console.error('Error al cerrar canal:', err.message);
      channel = null;
      cb();
    });
  };

  const closeConnection = () => {
    if (!connection) return finalCallback();
    
    connection.close((err) => {
      connection = null;
      finalCallback(err || undefined);
    });
  };

  closeChannel(closeConnection);
}

// Manejo de cierre de proceso
process.on('SIGINT', () => {
  gracefulShutdown(() => process.exit(0));
});

process.on('SIGTERM', () => {
  gracefulShutdown(() => process.exit(0));
});