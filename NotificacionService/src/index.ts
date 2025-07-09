import dotenv from 'dotenv';
dotenv.config();

import { connectRabbitMQ } from './config/rabbitmq';
import { startWebSocketServer } from './sockets/websocket.server';

const PORT = parseInt(process.env.PORT || '3003');

startWebSocketServer(PORT);
connectRabbitMQ();
