const Sequelize = require("sequelize");
const dayjs = require('dayjs');

const sequelize = new Sequelize("chat_db", "samokish", "qwerty", {
    dialect: "mysql",
    host: "localhost",
});

const Message = sequelize.define("message", {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    chatId: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    message: {
        type: Sequelize.STRING,
        allowNull: false
    },
    userId: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
}, {
    getterMethods: {
        createdAt: function () {
            let createdAt = this.getDataValue('createdAt');
            return dayjs(createdAt).format('DD-MM-YYYY HH:mm:ss');
        }
    }
});

/**
 * @returns Promise
 */
Message.countMessagesInChats = function() {
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
Message.countMessagesInChat = function(id) {
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
Message.getByChatId = function(id) {
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
Message.getById = function(id) {
    return Message.findOne({
        where: {id: id},
        include: [{
            model: User,
            attributes: ["login"]
        }]
    });
};

sequelize.sync().then(result => console.log("Message schema created successfully."))
    .catch( err=> console.log(err));

module.exports =  Message;
const User = require("./user.js");
Message.belongsTo(User);
const Chat = require("./chat.js");
Message.belongsTo(Chat);