// src/sockets/websocket.js

export function initWebSocket(io) {
  io.on('connection', (socket) => {
    console.log(`📡 Cliente conectado: ${socket.id}`);

    // Puedes escuchar eventos personalizados si lo deseas
    socket.on('disconnect', () => {
      console.log(`❌ Cliente desconectado: ${socket.id}`);
    });
  });
}
