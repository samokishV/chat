const Sequelize = require('sequelize');
const Chat = require('../models/chat.js');
const User = require('../models/user.js');
const Message = require('../models/message.js');
const logger = require('../logger.js');

const ChatService = {};

/**
 * @param {string} title
 * @param {number} userId
 * @returns Promise
 */
ChatService.create = (title, userId) => Chat.create({
  title,
  userId,
}).then(
  result => ChatService.findById(result.id),
).catch(
  (err) => {
    console.log(err);
    logger.error(`Error creating new chat: title ${title}, userId ${userId} in ChatService.create`);
  },
);

/**
 * @returns Promise
 */
ChatService.getFullInfo = () => Chat.findAll({
  attributes: ['id', 'title', 'createdAt',
    [Sequelize.fn('count', Sequelize.col('messages.message')), 'count'],
  ],
  include: [{
    model: User,
    attributes: ['login'],
  }, {
    model: Message,
    attributes: ['id', 'message'],
  }],
  order: [
    ['createdAt', 'ASC'],
  ],
  group: [Sequelize.col('chat.id'), Sequelize.col('messages.id')],
}).catch(
  (err) => {
    console.log(err);
    logger.error('Error finding chats in ChatService.getFullInfo()');
  },
);


/**
 * @param {number} id
 * @returns Promise
 */
ChatService.findById = id => Chat.findOne({
  where: { id },
  attributes: ['id', 'title', 'createdAt',
    [Sequelize.fn('count', Sequelize.col('messages.message')), 'count'],
  ],
  include: [{
    model: User,
    attributes: ['login'],
  }, {
    model: Message,
    attributes: ['id', 'message'],
  }],
  group: [Sequelize.col('chat.id'), Sequelize.col('messages.id')],
}).catch(
  (err) => {
    console.log(err);
    logger.error(`Error finding chat: id ${id} in ChatService.findById()`);
  },
);


/**
 * param {number} id
 * @returns Promise
 */
ChatService.exists = id => Chat.findOne({
  where: { id },
}).catch(
  (err) => {
    console.log(err);
    logger.error(`Error finding chat: id ${id} in ChatService.exists()`);
  },
);

/**
 * @param {number} id
 * @returns Promise
 */
ChatService.deleteById = id => Chat.destroy({
  where: { id },
}).catch(
  (err) => {
    console.log(err);
    logger.error(`Error destroying chat: id ${id} in ChatService.deleteById()`);
  },
);

module.exports = ChatService;
