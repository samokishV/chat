const { validationResult } = require('express-validator');
const { htmlDecode } = require('js-htmlencode');
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
