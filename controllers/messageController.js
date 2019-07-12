const { validationResult } = require('express-validator');
const MessageService = require('../services/messageService');
const ChatService = require('../services/chatService');


exports.index = async (req, res) => {
  const chatId = req.params.id;

  const chat = await ChatService.findById(chatId);
  const pageTitle = chat.title;

  const messages = await MessageService.getByChatId(chatId);

  res.render('chatPage.hbs', {
    title: pageTitle,
    messages,
    room: chatId,
    auth: true
  });
};

exports.create = async (req, res) => {
  const chatId = req.params.id;
  let userId = req.cookies['user_id'];
  const {message} = req.body;

  const errors = validationResult(req);

  if (errors.isEmpty()) {
    MessageService.create(chatId, message, userId).then(async (result) => {
      const message = await MessageService.getById(result.id);
      res.send(message);
    });
  }
};

exports.getPartial = (req, res) => {
  const message = JSON.parse(req.body.message);

  res.render('partials/userMessage.hbs', {
    message,
    layout: false,
  });
};
