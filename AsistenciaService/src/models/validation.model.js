import { pool } from '../database.js';

// Busca entrada válida por código QR
export async function findEntradaByQR(qr, eventoId) {
  const result = await pool.query(
    `SELECT * FROM entradas WHERE qr_code = $1 AND evento_id = $2`,
    [qr, eventoId]
  );
  return result.rows[0];
}

// Inserta registro de validación
export async function registrarValidacion({ codigoQR, eventoId, usuarioId, puerta }) {
  const result = await pool.query(`
    INSERT INTO validaciones_qr (codigo_qr, evento_id, usuario_id, puerta, estado)
    VALUES ($1, $2, $3, $4, 'usado')
    RETURNING *;
  `, [codigoQR, eventoId, usuarioId, puerta]);

  return result.rows[0];
}
