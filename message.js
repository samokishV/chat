const Sequelize = require("sequelize");

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
    }
});

/**
 * @param {number} chatId
 * @returns Promise
 */
Message.countMessagesInChat = function(chatId) {
    return Message.findOne({
        raw: true,
        where:{chatId: chatId},
        attributes: ['chatId', [Sequelize.fn('count', Sequelize.col('chatId')), 'count']],
        group: ['chatId']
    }).then(result => {
        if(result) return result.count;
        else return 0;
    });
};

sequelize.sync().then(result => console.log("Message schema created successfully."))
    .catch( err=> console.log(err));

module.exports =  Message;
const User = require("./user.js");
Message.belongsTo(User);
const Chat = require("./chat.js");
Message.belongsTo(Chat);