import {
  registrarAsistencia,
  obtenerAsistencias,
} from "../models/asistencia.model.js";

import { publishEvent } from "../rabbitmq.js";

export async function crearAsistencia(req, res) {
  const { eventoId, usuarioId, puerta } = req.body;

  if (!eventoId || !usuarioId || !puerta) {
    return res.status(400).json({ error: "Faltan campos obligatorios." });
  }

  try {
    const asistencia = await registrarAsistencia({
      eventoId,
      usuarioId,
      puerta,
    });

    await publishEvent("eventos", {
      tipo: "asistencia_registrada",
      data: {
        eventoId,
        usuarioId,
        puerta,
        hora: asistencia.fecha_hora,
      },
    });

    res.status(201).json(asistencia);
  } catch (err) {
    console.error("❌ Error al registrar asistencia:", err);
    res.status(500).json({ error: "No se pudo registrar la asistencia." });
  }
}

export async function listarAsistencias(req, res) {
  try {
    const asistencias = await obtenerAsistencias();
    res.json(asistencias);
  } catch (err) {
    console.error("❌ Error al obtener asistencias:", err);
    res.status(500).json({ error: "Error interno." });
  }
}
