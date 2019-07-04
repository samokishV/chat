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
        type: Sequelize.VIRTUAL,
        defaultValue: 0
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
    }).then(chats => {
        return JSON.parse(JSON.stringify(chats))
    });

    let count = await Message.countMessagesInChats();

    // set value for virtual count property
    count.forEach(function(number) {
        let obj = chats.find(obj => obj.id === number.chatId);
        obj.count = number.count;
    });

    return chats;
};

sequelize.sync().then(result => console.log("Chat schema created successfully."))
    .catch( err=> console.log(err));

module.exports =  Chat;
const User = require("./user.js");
Chat.belongsTo(User);
const Message = require("./message.js");
Chat.hasMany(Message);




