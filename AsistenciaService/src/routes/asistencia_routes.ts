import express from 'express';
import { registrarAsistencia, obtenerAsistencia } from '../controllers/asistencia.controller';

const router = express.Router();

router.post('/', registrarAsistencia);
router.get('/:id', obtenerAsistencia);

export default router;
