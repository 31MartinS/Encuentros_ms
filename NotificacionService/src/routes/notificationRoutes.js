// src/routes/notificationRoutes.js

import express from 'express';
import { enviarNotificacion } from '../controllers/notificationController.js';

const router = express.Router();

// Endpoint: POST /notificaciones
router.post('/notificaciones', enviarNotificacion);

export default router;
