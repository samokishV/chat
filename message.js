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
    message: {
        type: Sequelize.STRING,
        allowNull: false
    },
    userId: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
});

sequelize.sync().then(result => console.log("Message schema created successfully."))
    .catch( err=> console.log(err));

module.exports =  Message;
const User = require("./user.js");
const ChatsMessage = require("./chatsMessage.js");
Message.belongsToMany(User, {through: ChatsMessage});