import { Router } from "express";
import { validarQR } from "../controllers/validation.controller.js";

const router = Router();

router.post("/", validarQR);

export default router;
