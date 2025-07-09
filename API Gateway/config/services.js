require("dotenv").config();

module.exports = {
  asistenciaService: process.env.ASISTENCIA_URL,
  entradaService: process.env.ENTRADA_URL,
  eventoService: process.env.EVENTOS_URL,
  usuarioService: process.env.USUARIOS_URL,
  notificacionService: process.env.NOTIFICACIONES_URL,
};
