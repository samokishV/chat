const Sequelize = require('sequelize');
const Message = require('../models/message.js');
const User = require('../models/user.js');

const MessageService = {};

/**
 * @param {number} chatId
 * @param {string} message
 * @param {number} userId
 * @returns Promise
 */
MessageService.create = (chatId, message, userId) => Message.create({
  chatId,
  message,
  userId,
});

/**
 * @returns Promise
 */
MessageService.countMessagesInChats = () => Message.findAll({
  raw: true,
  attributes: ['chatId', [Sequelize.fn('count', Sequelize.col('chatId')), 'count']],
  group: ['chatId'],
}).then(result => result);

/**
 * @param {number} id
 * @returns Promise
 */
MessageService.countMessagesInChat = id => Message.findAll({
  where: { chatId: id },
  raw: true,
  attributes: ['chatId', [Sequelize.fn('count', Sequelize.col('chatId')), 'count']],
  group: ['chatId'],
}).then(result => result);

/**
 * @param {number} id
 */
MessageService.getByChatId = id => Message.findAll({
  where: { chatId: id },
  include: [{
    model: User,
    attributes: ['login'],
  }],
  order: [
    ['createdAt', 'ASC'],
  ],
});

/**
 * @param id
 * @returns Promise
 */
MessageService.getById = id => Message.findOne({
  where: { id },
  include: [{
    model: User,
    attributes: ['login'],
  }],
});

module.exports = MessageService;
