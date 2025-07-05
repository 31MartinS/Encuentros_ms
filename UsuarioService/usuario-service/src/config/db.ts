import { Pool } from 'pg'; // Importa el pool de conexiones de PostgreSQL
import dotenv from 'dotenv'; // Carga variables de entorno desde un archivo .env

dotenv.config(); // Inicializa dotenv para acceder a variables de entorno

// Configuración del pool de conexiones a la base de datos
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // URL de conexión definida en .env
  ssl: process.env.NODE_ENV === 'production'
    ? { rejectUnauthorized: false } // En producción se habilita SSL sin verificación estricta
    : false // En desarrollo se desactiva SSL
});

// Verifica la conexión al iniciar el servicio
pool.connect()
  .then(() => console.log('🟢 Conectado a CockroachDB'))
  .catch((err) => console.error('🔴 Error al conectar a la base de datos:', err));
