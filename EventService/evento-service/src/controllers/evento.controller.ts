import { Request, Response } from 'express';
import { crearEvento, obtenerEventos } from '../services/evento.service';
import { getChannel } from '../config/rabbitmq';
import { validarEvento } from '../utils/validator';

export async function getEventos(_req: Request, res: Response) {
  try {
    const eventos = await obtenerEventos();
    res.status(200).json(eventos);
  } catch (error) {
    console.error('❌ Error al obtener eventos:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
}

export async function postEventos(req: Request, res: Response) {
  const { nombre, descripcion, fecha, zona_id } = req.body;

  const { valido, errores } = validarEvento(req.body);
  if (!valido) return res.status(400).json({ errores });

  try {
    const id = await crearEvento({ nombre, descripcion, fecha, zona_id });

    // Enviar notificación a RabbitMQ
    const channel = getChannel();
    await channel.assertQueue('notificaciones', { durable: true });

    channel.sendToQueue('notificaciones', Buffer.from(JSON.stringify({
      tipo: 'nuevo_evento',
      nombre,
      descripcion,
      fecha,
      zona_id,
      origen: 'EventoService',
      timestamp: new Date().toISOString()
    })));

    res.status(201).json({
      mensaje: 'Evento creado correctamente',
      id
    });
  } catch (error) {
    console.error('❌ Error al crear evento:', error);
    res.status(500).json({ error: 'Error}); interno del servidor.' });
  }
}
