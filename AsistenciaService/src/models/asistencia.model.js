import { pool } from '../database.js';

export async function registrarAsistencia({ eventoId, usuarioId, puerta }) {
  const result = await pool.query(`
    INSERT INTO asistencias (evento_id, usuario_id, puerta)
    VALUES ($1, $2, $3)
    RETURNING *;
  `, [eventoId, usuarioId, puerta]);

  return result.rows[0];
}

export async function obtenerAsistencias() {
  const result = await pool.query(`SELECT * FROM asistencias ORDER BY fecha_hora DESC`);
  return result.rows;
}
