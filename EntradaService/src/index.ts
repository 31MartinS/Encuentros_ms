import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import entradaRoutes from './routes/entradaRoutes';
import { connectToDB } from './config/db';
import { connectRabbitMQ } from './config/rabbitmq';

const PORT = parseInt(process.env.PORT || '3000');

const app = express();
app.use(express.json());

app.use('/entradas', entradaRoutes);

app.listen(PORT, async () => {
  await connectToDB();
  await connectRabbitMQ();
  console.log(`🎟️ Entrada service escuchando en puerto ${PORT}`);
});
