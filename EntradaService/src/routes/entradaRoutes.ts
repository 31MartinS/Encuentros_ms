import { Router } from 'express';
import { comprarEntrada, listarEntradas } from '../controllers/entradaController';

const router = Router();

router.post('/', comprarEntrada);
router.get('/', listarEntradas);

export default router;
