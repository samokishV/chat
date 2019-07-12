const Chat = require('../models/chat.js');
const User = require('../models/user.js');
const Message = require('../models/message.js');
const Sequelize = require('sequelize');

const ChatService = {};

/**
 * @param {string} title
 * @param {number} userId
 * @returns Promise
 */
ChatService.create = (title, userId) => Chat.create({
  title,
  userId,
}).then(result => ChatService.findById(result.id));

/**
 * @returns Promise
 */
ChatService.getFullInfo = async () => {
  let chats = await Chat.findAll({
      attributes: ['id', 'title', 'createdAt',
        [Sequelize.fn('count', Sequelize.col('messages.message')), 'count']
      ],
      include: [{
        model: User,
        attributes: ['login'],
      }, {
        model: Message,
        attributes: ['id', 'message']
      }],
      order: [
        ['createdAt', 'ASC'],
      ],
      group: [Sequelize.col('chat.id'), Sequelize.col('messages.id')]
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
    attributes: ['id', 'title', 'createdAt',
       [Sequelize.fn('count', Sequelize.col('messages.message')), 'count']
    ],
    include: [{
      model: User,
      attributes: ['login'],
    }, {
        model: Message,
        attributes: ['id', 'message']
    }],
    group: [Sequelize.col('chat.id'), Sequelize.col('messages.id')]
  });

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
