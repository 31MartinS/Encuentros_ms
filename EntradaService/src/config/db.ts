import { Pool } from 'pg';

export const pool = new Pool({
  host: process.env.PG_HOST,
  port: Number(process.env.PG_PORT),
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  database: process.env.PG_DATABASE
});

export async function connectToDB() {
  try {
    await pool.connect();
    console.log('🟢 Conectado a CockroachDB');
  } catch (err) {
    console.error('🔴 Error al conectar a la base de datos:', err);
    process.exit(1);
  }
}
