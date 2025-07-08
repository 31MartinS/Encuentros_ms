import express from 'express';
import pool from '../config/db';
import { channel } from '../config/rabbitmq';

export const registrarAsistencia = async (req: express.Request, res: express.Response): Promise<void> => {
  const { idEntrada } = req.body;

  try {
    const result = await pool.query('SELECT * FROM asistencias WHERE id_entrada = $1', [idEntrada]);

    if (result.rows.length > 0) {
      res.status(400).json({ message: 'Asistencia ya registrada' });
      return;
    }

    const nueva = await pool.query(
      'INSERT INTO asistencias(id_entrada, fecha) VALUES($1, NOW()) RETURNING *',
      [idEntrada]
    );

    if (channel) {
      channel.sendToQueue('notificaciones', Buffer.from(JSON.stringify({
        type: 'ASISTENCIA_REGISTRADA',
        data: nueva.rows[0]
      })));
    }

    res.status(201).json(nueva.rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Error al registrar asistencia', error: err });
  }
};

export const obtenerAsistencia = async (req: express.Request, res: express.Response): Promise<void> => {
  const { id } = req.params;

  try {
    const result = await pool.query('SELECT * FROM asistencias WHERE id_entrada = $1', [id]);

    if (result.rows.length === 0) {
      res.status(404).json({ message: 'Asistencia no encontrada' });
      return;
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener asistencia', error: err });
  }
};
