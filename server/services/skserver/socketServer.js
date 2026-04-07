const { Server } = require('socket.io');

let io;

const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    console.log('ON:', socket.id);

    socket.on('disconnect', () => {
      console.log('OFF:', socket.id);
    });
  });

  return io;
};

const getIO = () => {
  if (!io) {
    throw new Error('LOI-skserver/socketServer');
  }
  return io;
};

module.exports = { initializeSocket, getIO };
