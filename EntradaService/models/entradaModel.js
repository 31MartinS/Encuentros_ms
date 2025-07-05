import { pool } from '../config/db.js';

export const crearEntrada = async ({ eventoId, usuarioId, asiento, qrCode }) => {
  const query = `
    INSERT INTO entradas (evento_id, usuario_id, asiento, qr_code)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
  `;
  const values = [eventoId, usuarioId, asiento, qrCode];
  const result = await pool.query(query, values);
  return result.rows[0];
};

export const obtenerEntradas = async () => {
  const result = await pool.query('SELECT * FROM entradas;');
  return result.rows;
};
