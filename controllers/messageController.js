const { validationResult } = require('express-validator');
const MessageService = require('../services/messageService');
const ChatService = require('../services/chatService');


exports.index = async (request, response) => {
  const chatId = request.params.id;

  const chat = await ChatService.findById(chatId);
  const pageTitle = chat.title;

  const messages = await MessageService.getByChatId(chatId);

  response.render('chatPage.hbs', {
    title: pageTitle,
    messages,
    room: chatId,
  });
};

exports.create = async (request, response) => {
  const chatId = request.params.id;
  const userId = request.session.user_id;
  const {message} = request.body;

  const errors = validationResult(request);

  if (errors.isEmpty()) {
    MessageService.create(chatId, message, userId).then(async (result) => {
      const message = await MessageService.getById(result.id);
      response.send(message);
    });
  }
};

exports.getPartial = (request, response) => {
  const message = JSON.parse(request.body.message);

  response.render('partials/userMessage.hbs', {
    message,
    layout: false,
  });
};
