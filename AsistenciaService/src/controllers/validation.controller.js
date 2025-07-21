import {
  findEntradaByQR,
  registrarValidacion,
} from "../models/validation.model.js";

import { publishEvent } from "../rabbitmq.js";

export async function validarQR(req, res) {
  const { codigoQR, eventoId, puerta } = req.body;

  if (!codigoQR || !eventoId || !puerta) {
    return res.status(400).json({ error: "Faltan datos obligatorios." });
  }

  try {
    const entrada = await findEntradaByQR(codigoQR, eventoId);

    if (!entrada) {
      return res.status(403).json({ mensaje: "QR inválido o no encontrado." });
    }

    // Simulación: en este diseño no hay campo "estado", podrías tener uno en validaciones_qr
    const yaValidada = await pool.query(
      `
      SELECT * FROM validaciones_qr WHERE codigo_qr = $1 AND estado = 'usado'
    `,
      [codigoQR]
    );

    if (yaValidada.rowCount > 0) {
      return res.status(403).json({ mensaje: "QR ya ha sido validado." });
    }

    const validacion = await registrarValidacion({
      codigoQR,
      eventoId,
      usuarioId: entrada.usuario_id,
      puerta,
    });

    // Enviar evento por RabbitMQ
    await publishEvent("eventos", {
      tipo: "asistencia_registrada",
      data: {
        eventoId,
        usuarioId: entrada.usuario_id,
        puerta,
        hora: new Date().toISOString(),
      },
    });

    res.json({
      mensaje: "Acceso permitido",
      asistenciaRegistrada: true,
      puerta,
      hora: validacion.fecha_hora,
      asiento: entrada.asiento,
    });
  } catch (err) {
    console.error("❌ Error en validación QR:", err);
    res.status(500).json({ error: "Error interno al validar QR." });
  }
}
