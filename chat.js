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
    },
    count :{
        type: Sequelize.VIRTUAL
    }
},  {
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
Chat.getFullInfo = async function() {
    let chats = await Chat.findAll( {
        attributes: ['id', 'title', 'createdAt'],
        include: [{
            model: User,
            attributes: ["login"]
        }]
    });

    // set value for virtual count property
    chats.forEach(async function(chat) {
        let count = await Message.countMessagesInChat(chat.id);
        chat.setDataValue('count', count);
    });

    return await chats;
};

sequelize.sync().then(result => console.log("Chat schema created successfully."))
    .catch( err=> console.log(err));

module.exports =  Chat;
const User = require("./user.js");
Chat.belongsTo(User);
const Message = require("./message.js");
Chat.hasMany(Message);




