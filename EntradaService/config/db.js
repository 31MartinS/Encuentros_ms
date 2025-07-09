import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

export const pool = new Pool({
  host: process.env.PG_HOST,
  port: process.env.PG_PORT,
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  database: process.env.PG_DATABASE,
  ssl: false // dejar false ya que estamos en modo inseguro
});

export async function connectWithRetry(retries = 5, delay = 3000) {
  for (let i = 0; i < retries; i++) {
    try {
      await pool.connect();
      console.log("🟢 Conectado a la base de datos");
      return;
    } catch (err) {
      console.log(`🔴 Error al conectar. Reintentando en ${delay}ms...`);
      await new Promise((res) => setTimeout(res, delay));
    }
  }
  throw new Error("❌ No se pudo conectar a la base de datos después de varios intentos.");
}
