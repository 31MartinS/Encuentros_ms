import { Request, Response } from 'express';
import { crearEntrada, obtenerEntradas } from '../models/entradaModel';
import QRCode from 'qrcode';

export async function comprarEntrada(req: Request, res: Response) {
  try {
    const { eventoId, usuarioId, asiento } = req.body;
    const qr = await QRCode.toDataURL(`${eventoId}-${usuarioId}-${asiento}`);
    const entrada = await crearEntrada({ eventoId, usuarioId, asiento, qrCode: qr });

    res.status(201).json(entrada);
  } catch (err: any) {
    console.error('❌ Error en comprarEntrada:', err.message);
    res.status(500).json({ error: 'Error al comprar entrada' });
  }
}

export async function listarEntradas(req: Request, res: Response) {
  const entradas = await obtenerEntradas();
  res.json(entradas);
}
