import { pool } from '../config/db';

export async function crearEntrada(data: {
  eventoId: string;
  usuarioId: string;
  asiento: string;
  qrCode: string;
}) {
  const result = await pool.query(
    `INSERT INTO entradas (evento_id, usuario_id, asiento, qr_code)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [data.eventoId, data.usuarioId, data.asiento, data.qrCode]
  );
  return result.rows[0];
}

export async function obtenerEntradas() {
  const result = await pool.query('SELECT * FROM entradas');
  return result.rows;
}
