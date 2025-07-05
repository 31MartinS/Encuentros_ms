import express from 'express';
import dotenv from 'dotenv';
import entradaRoutes from './routes/entradaRoutes.js';
import { connectWithRetry } from './config/db.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/entradas', entradaRoutes);

connectWithRetry().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
  });
}).catch((err) => {
  console.error('❌ Falló la conexión:', err);
});
