const express = require("express");
const router = express.Router();

const asistenciaRoutes = require("./asistencia_route");
const validacionRoutes = require("./asistencia_route");
const entradaRoutes = require("./entrada_route");
const eventosRoutes = require("./eventos_route");
const usuarioRoutes = require("./usuarios_route");
const notificacionRoutes = require("./notificaciones_route");

router.use("/api/asistencias", asistenciaRoutes);
router.use("/api/validaciones", validacionRoutes);
router.use("/api/entradas", entradaRoutes);
router.use("/api/eventos", eventosRoutes);
router.use("/api/usuarios", usuarioRoutes);
router.use("/api/notificaciones", notificacionRoutes);

module.exports = router;
