const Sequelize = require("sequelize");

const sequelize = new Sequelize("chat_db", "samokish", "qwerty", {
    dialect: "mysql",
    host: "localhost",
});

const ChatsMessage = sequelize.define("chats_message", {
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
    messageId: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
});

sequelize.sync().then(result => console.log("ChatMessage schema created successfully."))
    .catch( err=> console.log(err));

module.exports =  ChatsMessage;
const Message = require("./message.js");
ChatsMessage.belongsTo(Message);