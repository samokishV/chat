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
    auth: true,
  });
};

