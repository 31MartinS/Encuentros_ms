import { broadcast } from '../sockets/websocket.server';
import { logInfo } from '../utils/logger';

interface Notificacion {
  tipo: string;
  email?: string;
  nombre?: string;
  descripcion?: string;
  fecha?: string;
  zona_id?: number;
  origen?: string;
}

export async function handleNotificacion(data: Notificacion) {
  switch (data.tipo) {
    case 'nuevo_registro':
      logInfo(`📧 Bienvenida a ${data.email}`);
      broadcast({
        mensaje: `Nuevo usuario registrado: ${data.nombre}`,
        tipo: data.tipo,
        fecha: data.fecha
      });
      break;

    case 'nuevo_evento':
      logInfo(`🎉 Evento registrado: ${data.nombre}`);
      broadcast({
        mensaje: `🎤 Nuevo evento: ${data.nombre}`,
        descripcion: data.descripcion,
        fecha: data.fecha,
        tipo: data.tipo,
        zona: data.zona_id
      });
      break;

    default:
      logInfo(`📦 Notificación desconocida: ${JSON.stringify(data)}`);
      broadcast({
        mensaje: 'Notificación sin tipo definido',
        data
      });
  }
}
