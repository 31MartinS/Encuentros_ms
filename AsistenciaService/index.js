import express from 'express';
import dotenv from 'dotenv';
import { connectToDatabase } from './database.js';
import { connectToRabbitMQ } from './rabbitmq.js';
import registerWithEureka from './eureka.js';

import validationRoutes from './routes/validation.routes.js';
import asistenciaRoutes from './routes/asistencia.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(express.json());

// Rutas
app.use('/validaciones', validationRoutes);
app.use('/asistencias', asistenciaRoutes);

// Inicialización
const startService = async () => {
  try {
    await connectToDatabase();
    await connectToRabbitMQ();
    registerWithEureka();

    app.listen(PORT, () => {
      console.log(`🚀 AsistenciaService ejecutándose en el puerto ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Error al iniciar el servicio:', error);
    process.exit(1);
  }
};

startService();
