const { validationResult } = require('express-validator');
const ChatService = require('../services/chatService.js');
const UserService = require('../services/userService.js');


exports.index = async (req, res) => {
  const chats = await ChatService.getFullInfo();

  const userId = req.session.user_id;
  const user = await UserService.findById(userId);

  res.render('chat.hbs', {
    title: 'Chats',
    chats,
    login: user.login,
    auth: true
  });
};

exports.create = async (req, res) => {
  const { title } = req.body;
  const userId = req.session.user_id;

  const errors = validationResult(req);

  if (errors.isEmpty()) {
    ChatService.create(title, userId).then(async (result) => {
      const chat = await ChatService.findById(result.id);
      res.send(chat);
    });
  }
};

exports.delete = async (req, res) => {
  const chatId = req.params.id;

  ChatService.deleteById(chatId).then(
    res.send({ id: chatId })
  );
};

exports.getPartial = (req, res) => {
  const chat = JSON.parse(req.body.chat);
  const { login } = req.body;

  res.render('partials/chat.hbs', {
    chat,
    login,
    layout: false,
  });
};
