import express from 'express';
import { comprarEntrada, listarEntradas } from '../controllers/entradaController.js';

const router = express.Router();

router.post('/', comprarEntrada);
router.get('/', listarEntradas);

export default router;
