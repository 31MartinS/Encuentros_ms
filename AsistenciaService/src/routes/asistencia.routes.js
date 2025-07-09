import { Router } from 'express';
import {
  crearAsistencia,
  listarAsistencias
} from '../controllers/asistencia.controller.js';

const router = Router();

router.post('/', crearAsistencia);
router.get('/', listarAsistencias);

export default router;
