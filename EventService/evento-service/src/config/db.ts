import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production'
    ? { rejectUnauthorized: false }
    : false
});

// Exportamos una función para conectar (usada en index.ts)
export async function connectDB() {
  try {
    await pool.connect();
    console.log('🟢 Conectado a CockroachDB');
  } catch (err: any) {
    console.error('🔴 Error al conectar a la base de datos:', err.message);
    process.exit(1);
  }
}
