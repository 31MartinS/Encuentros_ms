import express from 'express';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import dotenv from 'dotenv';
import cors from 'cors';
import { setupRabbitMQConsumer } from './consumers/rabbitConsumer.js';
import { initWebSocket } from './sockets/websocket.js';
import notificationRoutes from './routes/notificationRoutes.js';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

app.use(cors());
app.use(express.json());

// Endpoint de prueba
app.get('/', (req, res) => {
  res.send('🔔 NotificacionService está corriendo');
});

// Iniciar WebSocket y RabbitMQ
initWebSocket(io);
setupRabbitMQConsumer(io); // Cuando lo creemos

// Iniciar servidor
const PORT = process.env.PORT || 3003;
server.listen(PORT, () => {
  console.log(`🚀 NotificacionService corriendo en el puerto ${PORT}`);
});

app.use('/api', notificationRoutes);
