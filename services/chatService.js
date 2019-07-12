const Chat = require('../models/chat.js');
const User = require('../models/user.js');
const MessageService = require('../services/messageService');

const ChatService = {};

/**
 * @param {string} title
 * @param {number} userId
 * @returns Promise
 */
ChatService.create = (title, userId) => Chat.create({
  title,
  userId,
});

/**
 * @returns Promise
 */
ChatService.getFullInfo = async () => {
  let chats = await Chat.findAll({
    attributes: ['id', 'title', 'createdAt'],
    include: [{
      model: User,
      attributes: ['login'],
    }],
    order: [
      ['createdAt', 'ASC'],
    ],
  }).then(chat => JSON.parse(JSON.stringify(chat)));

  let count = await MessageService.countMessagesInChats();

  // set value for virtual count property
  count.forEach((number) => {
    let obj = chats.find(obj => obj.id === number.chatId);
    obj.count = number.count;
  });

  return chats;
};

/**
 * @param {number} id
 * @returns Promise
 */
ChatService.findById = async (id) => {
  let chat = await Chat.findOne({
    where: { id },
    attributes: ['id', 'title', 'createdAt'],
    include: [{
      model: User,
      attributes: ['login'],
    }],
  }).then(chat => JSON.parse(JSON.stringify(chat)));

  let count = await MessageService.countMessagesInChat(id);

  if (count.length > 0) {
    chat.count = count;
  } else {
    chat.count = 0;
  }

  return chat;
};

/**
 * param {number} id
 * @returns Promise
 */
ChatService.exists = id => Chat.findOne({
  where: { id },
});

/**
 * @param {number} id
 * @returns Promise
 */
ChatService.deleteById = id => Chat.destroy({
  where: { id },
});

module.exports = ChatService;
