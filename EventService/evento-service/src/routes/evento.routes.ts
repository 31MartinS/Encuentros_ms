import { Router } from 'express';
import { getEventos, postEventos } from '../controllers/evento.controller';

const router = Router();

router.get('/', getEventos);
router.post('/', postEventos);

export default router;
