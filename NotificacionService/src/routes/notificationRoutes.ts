import express, { Router, Request, Response } from "express";
import { enviarNotificacion } from "../controllers/notificationController";

const router: Router = express.Router();

router.post("/api/notificaciones", enviarNotificacion);

export default router;
