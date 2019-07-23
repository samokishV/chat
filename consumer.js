module.exports = {
  start(io) {
    io.on('connection', (socket) => {
      socket.on('room', (data) => {
        socket.join(data.room);
      });

      socket.on('chatCreate', (data) => {
        socket.broadcast.emit('chatAdd', data);
      });

      socket.on('chatRemove', (data) => {
        io.emit('chatDelete', data);
      });

      socket.on('messageCreate', (data) => {
        io.emit('messageAddGlobal', data);
        socket.broadcast.to(data.room).emit('messageAdd', data);
      });
    });
  },
};
