const Sequelize = require('sequelize');
const dayjs = require('dayjs');
const decode = require('unescape');
const sequelize = require('./dbConnect');
const logger = require('../logger.js');

const Message = sequelize.define('message', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  chatId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  message: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  userId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
}, {
  getterMethods: {
    message() {
      const message = this.getDataValue('message');
      return decode(message);
    },
    createdAt() {
      const createdAt = this.getDataValue('createdAt');
      return dayjs(createdAt).format('DD-MM-YYYY HH:mm:ss');
    },
  },
});

sequelize.sync().then(result => console.log('Message schema created successfully.'))
  .catch((err) => {
    console.log(err);
    logger.error('Error creating Message schema');
  });

module.exports = Message;
const User = require('./user.js');

Message.belongsTo(User);
const Chat = require('./chat.js');

Message.belongsTo(Chat);
