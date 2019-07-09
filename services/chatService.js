const Chat = require('../models/chat.js');
const User = require('../models/user.js');
const MessageService = require("../services/messageService");

const ChatService = {};

/**
 * @param {string} title
 * @param {number} userId
 * @returns Promise
 */
ChatService.create = function(title, userId) {
    return Chat.create({
        title: title,
        userId: userId
    });
};

/**
 * @returns Promise
 */
ChatService.getFullInfo = async function() {
    let chats = await Chat.findAll( {
        attributes: ['id', 'title', 'createdAt'],
        include: [{
            model: User,
            attributes: ["login"]
        }],
        order: [
            ['createdAt', 'ASC']
        ]
    }).then(chats => {
        return JSON.parse(JSON.stringify(chats))
    });

    let count = await MessageService.countMessagesInChats();

    // set value for virtual count property
    count.forEach(function(number) {
        let obj = chats.find(obj => obj.id === number.chatId);
        obj.count = number.count;
    });

    return chats;
};

/**
 * @param {number} id
 * @returns Promise
 */
ChatService.findById = async function(id) {
    let chat = await Chat.findOne( {
        where: {id : id},
        attributes: ['id', 'title', 'createdAt'],
        include: [{
            model: User,
            attributes: ["login"]
        }]
    }).then(chat => {
        return JSON.parse(JSON.stringify(chat))
    });

    let count = await MessageService.countMessagesInChat(id);

    if(count.length > 0) {
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
ChatService.exists = async function(id) {
    return await Chat.findOne({
        where: {id: id}
    });
};

/**
 * @param {number} id
 * @returns Promise
 */
ChatService.deleteById = async function(id) {
    return await Chat.destroy({
        where: {id: id}
    });
};

module.exports = ChatService;