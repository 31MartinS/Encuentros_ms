import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from './routes/user.routes';
import './config/db';
import { connectRabbitMQ } from './config/rabbitmq';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api/usuarios', userRoutes);

app.get('/', (_req, res) => {
  res.send('Usuario Service funcionando 🟢');
});

app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});

connectRabbitMQ();
(async () => {
  await connectRabbitMQ(); 
})();