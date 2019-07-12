const { validationResult } = require('express-validator');
const MessageService = require('../services/messageService');
const ChatService = require('../services/chatService');


exports.index = async (req, res) => {
  let chatId = req.params.id;

  let chat = await ChatService.findById(chatId);
  let pageTitle = chat.title;

  let messages = await MessageService.getByChatId(chatId);

  res.render('chatPage.hbs', {
    title: pageTitle,
    messages,
    room: chatId,
    auth: true
  });
};

exports.create = async (req, res) => {
  let chatId = req.params.id;
  let userId = req.cookies['user_id'];
  let {message} = req.body;

  let errors = validationResult(req);

  if (errors.isEmpty()) {
    MessageService.create(chatId, message, userId).then(async (result) => {
      res.send(result);
    });
  }
};

exports.getPartial = (req, res) => {
  let message = JSON.parse(req.body.message);

  res.render('partials/userMessage.hbs', {
    message,
    layout: false,
  });
};
