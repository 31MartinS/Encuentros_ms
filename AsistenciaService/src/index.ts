import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import asistenciaRoutes from './routes/asistencia.routes';
import './config/db';
import './config/rabbitmq';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3004;

app.use(cors());
app.use(express.json());
app.use('/api/asistencias', asistenciaRoutes);

app.listen(PORT, () => {
  console.log(`✅ Asistencia Service escuchando en http://localhost:${PORT}`);
});
