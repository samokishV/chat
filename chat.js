const Sequelize = require("sequelize");
const dayjs = require('dayjs');

const sequelize = new Sequelize("chat_db", "samokish", "qwerty", {
    dialect: "mysql",
    host: "localhost",
});

const Chat = sequelize.define("chat", {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    userId: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
}, {
        getterMethods: {
            messages: function() {
                return Chat.countMessages(this.id);
            },
            createdAt: function () {
                let createdAt = this.getDataValue('createdAt');
                return dayjs(createdAt).format('DD-MM-YYYY HH:mm:ss');
            }
        }
    }
);

sequelize.sync().then(result => console.log("Chat schema created successfully."))
    .catch( err=> console.log(err));

/**
 * @param {number} id
 */
Chat.countMessages = function(id) {
    return 100;
    //return Message,countMessagesInChat(id);
};

module.exports =  Chat;
const User = require("./user.js");
Chat.belongsTo(User);
const Message = require("./message.js");
const ChatsMessage = require("./chatsMessage.js");
Chat.belongsToMany(Message, {through: ChatsMessage});




