// src/models/notificationModel.js

/**
 * Modelo lógico para una notificación del sistema Encuentros.
 * Este módulo define el formato y la validación de una notificación.
 */

const allowedTypes = ['info', 'alerta', 'error', 'confirmacion'];
const allowedDestinations = ['todos', 'staff', 'asistentes', 'organizador'];

/**
 * Crea y valida una notificación del sistema.
 * 
 * @param {Object} data 
 * @param {string} data.tipo - Tipo de notificación (info, alerta, error, confirmacion)
 * @param {string} data.mensaje - Contenido de la notificación
 * @param {string} [data.destino='todos'] - Destinatario: todos, staff, asistentes, organizador, etc.
 * @param {string} [data.eventoId] - ID del evento relacionado (opcional)
 * @param {string} [data.usuarioId] - ID del usuario específico (opcional)
 * @returns {Object} Notificación validada y estructurada
 */
export function crearNotificacion(data) {
  const { tipo, mensaje, destino = 'todos', eventoId = null, usuarioId = null } = data;

  if (!mensaje || typeof mensaje !== 'string') {
    throw new Error('El mensaje de la notificación es obligatorio y debe ser texto.');
  }

  if (!allowedTypes.includes(tipo)) {
    throw new Error(`Tipo de notificación inválido. Valores permitidos: ${allowedTypes.join(', ')}`);
  }

  if (!allowedDestinations.includes(destino) && !destino.startsWith('usuario:')) {
    throw new Error(`Destino inválido. Usa uno de: ${allowedDestinations.join(', ')} o usuario:<id>`);
  }

  return {
    tipo,
    mensaje,
    destino,
    eventoId,
    usuarioId,
    timestamp: new Date().toISOString()
  };
}
