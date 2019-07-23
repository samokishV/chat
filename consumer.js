module.exports = {
  start(io) {
    io.on('connection', (socket) => {
      socket.on('room', (data) => {
        socket.join(data.room);
      });
    });
  }, 
};


