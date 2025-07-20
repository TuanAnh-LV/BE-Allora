let io = null;

module.exports = {
  init: (server) => {
    const { Server } = require('socket.io');
    io = new Server(server, { cors: { origin: '*' } });

    require('./chat.socket')(io);          
    require('./notification.socket')(io);

    return io;
  },
  getIO: () => {
    if (!io) throw new Error('Socket.io not initialized');
    return io;
  }
};
