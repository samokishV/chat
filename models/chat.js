const Sequelize = require('sequelize');
const dayjs = require('dayjs');
const decode = require('unescape');
const sequelize = require('./dbConnect');
const logger = require('../logger.js');

const Chat = sequelize.define('chat', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  title: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  userId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  count: {
    type: Sequelize.VIRTUAL,
    defaultValue: 0,
  },
}, {
  getterMethods: {
    title() {
      let title = this.getDataValue('title');
      return decode(title);
    },
    createdAt() {
      let createdAt = this.getDataValue('createdAt');
      return dayjs(createdAt).format('DD-MM-YYYY HH:mm:ss');
    },
  },
});

sequelize.sync().then(result => console.log('Chat schema created successfully.'))
  .catch(err => {
    console.log(err);
    logger.error(`Error creating Chat schema`);
  });

module.exports = Chat;
const User = require('./user.js');

Chat.belongsTo(User);
const Message = require('./message.js');

Chat.hasMany(Message);
