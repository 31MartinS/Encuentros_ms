import { crearEntrada, obtenerEntradas } from '../models/entradaModel.js';
import generarQR from '../services/qrService.js';
import { enviarNotificacion } from '../utils/rabbitSender.js';


export const comprarEntrada = async (req, res) => {
  try {
    const { eventoId, usuarioId, asiento } = req.body;

    const qrCode = await generarQR(`${eventoId}-${usuarioId}-${asiento}`);
    const entrada = await crearEntrada({ eventoId, usuarioId, asiento, qrCode });

    // ✅ Enviar notificación al usuario
    await enviarNotificacion({
      tipo: 'confirmacion',
      mensaje: `Tu entrada para el evento ${eventoId} ha sido registrada exitosamente.`,
      destino: `usuario:${usuarioId}`,
      eventoId,
      usuarioId
    });

    res.status(201).json(entrada);
  } catch (error) {
    console.error('❌ Error en comprarEntrada:', error);  
    res.status(500).json({ error: 'Error al comprar entrada' });
  }
};



export const listarEntradas = async (req, res) => {
  try {
    const entradas = await obtenerEntradas();
    res.json(entradas);
  } catch (error) {
    res.status(500).json({ error: 'Error al listar entradas' });
  }
};
