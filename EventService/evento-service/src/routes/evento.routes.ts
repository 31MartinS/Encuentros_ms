import { Router } from 'express';
import { getEventos, postEvento } from '../controllers/evento.controller';

const router = Router();

router.get('/', getEventos);
router.post('/', postEvento);

export default router;
