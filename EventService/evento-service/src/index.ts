import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import eventoRoutes from './routes/evento.routes';
import { connectDB } from './config/db';
import { connectRabbitMQ } from './config/rabbitmq';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;

app.use(cors());
app.use(express.json());

app.get('/', (_req, res) => res.send('Evento Service funcionando 🟢'));

app.use('/api/eventos', eventoRoutes);

app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});

// Conexión a servicios externos
connectDB();
connectRabbitMQ();
