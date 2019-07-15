const Message = require('../models/message.js');
const User = require('../models/user.js');
const logger = require('../logger.js');

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
}).then(
  result => MessageService.getById(result.id),
).catch(
  (err) => {
    console.log(err);
    logger.error(`Error creating message: chatId ${chatId}, message ${message}, userId ${userId} in MessageService.create()`);
  },
);

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
}).catch(
  (err) => {
    console.log(err);
    logger.error(`Error finding message: chatId ${id} in MessageService.getByChatId()`);
  },
);

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
}).catch(
  (err) => {
    console.log(err);
    logger.error(`Error finding message: id ${id} in MessageService.getById()`);
  },
);

module.exports = MessageService;
