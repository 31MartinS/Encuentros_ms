import { WebSocketServer, WebSocket } from 'ws';
import { logInfo } from '../utils/logger';

const clients = new Set<WebSocket>();

export function startWebSocketServer(port: number) {
  const wss = new WebSocketServer({ port });

  wss.on('connection', (ws) => {
    clients.add(ws);
    logInfo('🔗 Cliente WebSocket conectado');

    ws.on('close', () => {
      clients.delete(ws);
      logInfo('❌ Cliente WebSocket desconectado');
    });
  });

  logInfo(`📡 Servidor WebSocket escuchando en el puerto ${port}`);
}

export function broadcast(message: any) {
  const msg = JSON.stringify(message);
  for (const client of clients) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(msg);
    }
  }
}
