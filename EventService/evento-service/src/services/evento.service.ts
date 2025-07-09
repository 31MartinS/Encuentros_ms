import { pool } from '../config/db';
import { Evento } from '../models/evento.model';

export async function crearEvento(evento: Evento): Promise<number> {
  const result = await pool.query(
    `INSERT INTO eventos (nombre, descripcion, fecha, zona_id)
     VALUES ($1, $2, $3, $4)
     RETURNING id`,
    [evento.nombre, evento.descripcion, evento.fecha, evento.zona_id]
  );
  return result.rows[0].id;
}

export async function obtenerEventos(): Promise<Evento[]> {
  const result = await pool.query(`SELECT * FROM eventos ORDER BY fecha ASC`);
  return result.rows;
}
