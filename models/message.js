const Sequelize = require('sequelize');
const dayjs = require('dayjs');
const sequelize = require('./dbConnect');
const logger = require('../logger.js');
const htmlDecode = require('js-htmlencode').htmlDecode;

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
      return htmlDecode(message);
    },
    createdAt() {
      const createdAt = this.getDataValue('createdAt');
      return dayjs(createdAt).format('DD-MM-YYYY HH:mm:ss');
    },
  },
});

sequelize.sync().then(() => logger.debug('Message schema created successfully.'))
  .catch((err) => {
    logger.debug(err);
    logger.error('Error creating Message schema');
  });

module.exports = Message;
const User = require('./user.js');

Message.belongsTo(User);
const Chat = require('./chat.js');

Message.belongsTo(Chat);
