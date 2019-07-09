const { validationResult } = require('express-validator');
const ChatService = require('../services/chatService.js');
const UserService = require('../services/userService.js');


exports.index = async (request, response) => {
  const chats = await ChatService.getFullInfo();

  const userId = request.session.user_id;
  const user = await UserService.findById(userId);

  response.render('chat.hbs', {
    title: 'Chats',
    chats,
    login: user.login,
  });
};

exports.create = async (request, response) => {
  const { title } = request.body;
  const userId = request.session.user_id;

  const errors = validationResult(request);

  if (errors.isEmpty()) {
    ChatService.create(title, userId).then(async (result) => {
      const chat = await ChatService.findById(result.id);
      response.send(chat);
    });
  }
};

exports.delete = async (request, response) => {
  const chatId = request.params.id;

  ChatService.deleteById(chatId).then(
    response.send({ id: chatId })
  );
};

exports.getPartial = (request, response) => {
  const chat = JSON.parse(request.body.chat);
  const { login } = request.body;

  response.render('partials/chat.hbs', {
    chat,
    login,
    layout: false,
  });
};
