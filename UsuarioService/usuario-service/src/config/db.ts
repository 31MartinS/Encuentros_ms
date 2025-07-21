import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: false, 
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000
});

pool.on('connect', () => {
  console.log('🟢 Conexión establecida con CockroachDB');
});

pool.on('error', (err) => {
  console.error('🔴 Error en el pool de conexiones:', err);
});

// Función para probar la conexión al iniciar
export async function testConnection() {
  try {
    const client = await pool.connect();
    await client.query('SELECT 1');
    client.release();
    console.log('✅ Conexión a la base de datos verificada');
  } catch (err) {
    console.error('❌ Error al conectar a la base de datos:', err);
    throw err;
  }
}

testConnection(); 
