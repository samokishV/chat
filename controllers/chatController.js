const { validationResult } = require('express-validator');
const ChatService = require('../services/chatService.js');
const UserService = require('../services/userService.js');


exports.index = async (req, res) => {
  const chats = await ChatService.getFullInfo();
  const userId = req.cookies.user_id;
  const user = await UserService.findById(userId);

  res.render('chat.hbs', {
    title: 'Chats',
    chats,
    login: user.login,
    auth: true,
  });
};

exports.create = async (req, res, io) => {
  const { title } = req.body;
  const userId = req.cookies.user_id;

  const errors = validationResult(req);

  if (errors.isEmpty()) {
    ChatService.create(title, userId).then(async (result) => {
      io.emit('chatAdd', result);
      res.sendStatus(200);
    }).catch((err) => res.sendStatus(500));
  }
};

exports.delete = async (req, res, io) => {
  const chatId = req.params.id;

  ChatService.deleteById(chatId).then(async () => {
    io.emit('chatDelete', chatId);
    res.sendStatus(200);
  }).catch((err) => res.sendStatus(500));
};
