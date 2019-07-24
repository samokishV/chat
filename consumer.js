const cookie = require('cookie');
const MessageService = require('./services/messageService');
const ChatService = require('./services/chatService.js');
var htmlEncode = require('js-htmlencode').htmlEncode;

module.exports = {
  start(io) {
    io.on('connection', (socket) => {
      socket.on('room', (data) => {
        socket.join(data.room);
      });

      socket.on('messageCreate', (data) => {
        const chatId = data.id; 
        const cookies = cookie.parse(socket.request.headers.cookie); 
        const userId  = cookies.user_id;     
        let message = data.message;
        message = htmlEncode(message.trim());

        if(message) {
          MessageService.create(chatId, message, userId).then(async (result) => {
            io.emit('messageAddGlobal', result);
            io.to(result.chatId).emit('messageAdd', result);
          });
        }
      });

      socket.on('chatCreate', (data) => {
        const cookies = cookie.parse(socket.request.headers.cookie); 
        const userId  = cookies.user_id;
        let title = data.title;
        title = htmlEncode(title.trim());
      
        if(title) {
          ChatService.create(title, userId).then(async (result) => {
            io.emit('chatAdd', result);
          });
        }
      });

      socket.on('chatRemove', (data) => {
        const chatId = data.id;

        ChatService.deleteById(chatId).then(async () => {
          io.emit('chatDelete', {id: chatId});
        });
      });
    });
  }, 
};


