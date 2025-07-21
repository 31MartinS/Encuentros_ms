import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import notificationRoutes from './routes/notificationRoutes';
import { connectRabbitMQ } from './config/rabbitmq';
import { startWebSocketServer } from './sockets/websocket.server.js';

dotenv.config();

const app = express();
const PORT = parseInt(process.env.PORT || '3003');

app.use(cors());
app.use(express.json());
app.use(notificationRoutes); 

app.get('/', (_req, res) => {
  res.send('Notificaciones Service funcionando 🟢');
});

app.listen(PORT, () => {
  console.log(`✅ Servidor de Notificaciones corriendo en http://localhost:${PORT}`);
});

startWebSocketServer(PORT + 10);
connectRabbitMQ();
