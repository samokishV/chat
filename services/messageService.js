const Message = require('../models/message.js');
const User = require('../models/user.js');
const Sequelize = require("sequelize");

const MessageService = {};

/**
 * @param {number} chatId
 * @param {string} message
 * @param {number} userId
 * @returns Promise
 */
MessageService.create = function(chatId, message, userId) {
    return Message.create({
        chatId: chatId,
        message: message,
        userId: userId
    })
};

/**
 * @returns Promise
 */
MessageService.countMessagesInChats = function() {
    return Message.findAll({
        raw: true,
        attributes: ['chatId', [Sequelize.fn('count', Sequelize.col('chatId')), 'count']],
        group: ['chatId']
    }).then(result => {
        return result;
    });
};

/**
 * @param {number} id
 * @returns Promise
 */
MessageService.countMessagesInChat = function(id) {
    return Message.findAll({
        where: {chatId: id},
        raw: true,
        attributes: ['chatId', [Sequelize.fn('count', Sequelize.col('chatId')), 'count']],
        group: ['chatId']
    }).then(result => {
        return result;
    });
};

/**
 * @param {number} id
 */
MessageService.getByChatId = function(id) {
    return Message.findAll({
        where: {chatId: id},
        include: [{
            model: User,
            attributes: ["login"]
        }],
        order: [
            ['createdAt', 'ASC']
        ]
    });
};

/**
 * @param id
 * @returns Promise
 */
MessageService.getById = function(id) {
    return Message.findOne({
        where: {id: id},
        include: [{
            model: User,
            attributes: ["login"]
        }]
    });
};

module.exports = MessageService;
