const { validationResult } = require('express-validator');
const ChatService = require('../services/chatService.js');
const UserService = require('../services/userService.js');


exports.index = async (req, res) => {
  let chats = await ChatService.getFullInfo();
  let userId = req.cookies['user_id'];
  let user = await UserService.findById(userId);

  res.render('chat.hbs', {
    title: 'Chats',
    chats,
    login: user.login,
    auth: true
  });
};

exports.create = async (req, res) => {
  let { title } = req.body;
  let userId = req.cookies['user_id'];

  let errors = validationResult(req);

  if (errors.isEmpty()) {
    ChatService.create(title, userId).then(async (result) => {
      res.send(result);
    });
  }
};

exports.delete = async (req, res) => {
  let chatId = req.params.id;

  ChatService.deleteById(chatId).then(
    res.send({ id: chatId })
  );
};

exports.getPartial = (req, res) => {
  let chat = JSON.parse(req.body.chat);
  let { login } = req.body;

  res.render('partials/chat.hbs', {
    chat,
    login,
    layout: false,
  });
};
