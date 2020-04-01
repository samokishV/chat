const Sequelize = require('sequelize');
const bcrypt = require('bcrypt');
const { htmlDecode } = require('js-htmlencode');
const decode = require('unescape');
const sequelize = require('./dbConnect');
const logger = require('../logger.js');

const User = sequelize.define('user', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  login: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
  },
}, {
  getterMethods: {
    login() {
      const login = this.getDataValue('login');
      return htmlDecode(decode(login));
    },
  },
});

sequelize.sync().then(() => logger.debug('User schema created successfully.'))
  .catch((err) => {
    logger.debug(err);
    logger.error('Error creating User schema');
  });

User.beforeCreate(user => bcrypt.hash(user.password, 10)
  .then((hash) => {
    user.password = hash;
  })
  .catch((err) => {
    throw new Error(err);
  }));

module.exports = User;
const Chat = require('./chat.js');

User.hasMany(Chat);
