// src/models/notificationModel.ts

/**
 * Modelo lógico para una notificación del sistema Encuentros.
 * Este módulo define el formato y la validación de una notificación.
 */

export type NotificacionTipo = 'info' | 'alerta' | 'error' | 'confirmacion';
export type NotificacionDestino = 'todos' | 'staff' | 'asistentes' | 'organizador' | `usuario:${string}`;

export interface NotificacionInput {
  tipo: NotificacionTipo;
  mensaje: string;
  destino?: NotificacionDestino;
  eventoId?: string | null;
  usuarioId?: string | null;
}

export interface Notificacion extends NotificacionInput {
  destino: NotificacionDestino;
  eventoId: string | null;
  usuarioId: string | null;
  timestamp: string;
}

const allowedTypes: NotificacionTipo[] = ['info', 'alerta', 'error', 'confirmacion'];
const allowedDestinations: NotificacionDestino[] = ['todos', 'staff', 'asistentes', 'organizador'];

/**
 * Crea y valida una notificación del sistema.
 * 
 * @param data Datos de entrada para la notificación.
 * @returns Notificación validada y estructurada.
 */
export function crearNotificacion(data: Partial<NotificacionInput>): Notificacion {
  const {
    tipo,
    mensaje,
    destino = 'todos',
    eventoId = null,
    usuarioId = null
  } = data;

  if (!mensaje || typeof mensaje !== 'string') {
    throw new Error('El mensaje de la notificación es obligatorio y debe ser texto.');
  }

  if (!tipo || !allowedTypes.includes(tipo)) {
    throw new Error(`Tipo de notificación inválido. Valores permitidos: ${allowedTypes.join(', ')}`);
  }

  const esDestinoValido =
    allowedDestinations.includes(destino as NotificacionDestino) || (typeof destino === 'string' && destino.startsWith('usuario:'));

  if (!esDestinoValido) {
    throw new Error(`Destino inválido. Usa uno de: ${allowedDestinations.join(', ')} o usuario:<id>`);
  }

  return {
    tipo,
    mensaje,
    destino: destino as NotificacionDestino,
    eventoId,
    usuarioId,
    timestamp: new Date().toISOString()
  };
}
