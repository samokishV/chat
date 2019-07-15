const Sequelize = require('sequelize');
const bcrypt = require('bcrypt');
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
      let login = this.getDataValue('login');
      return decode(login);
    },
  },
});

sequelize.sync().then(result => console.log('User schema created successfully.'))
  .catch(err => {
    console.log(err);
    logger.error(`Error creating User schema`);
  });

User.beforeCreate((user, options) => bcrypt.hash(user.password, 10)
  .then((hash) => {
    user.password = hash;
  })
  .catch((err) => {
    throw new Error();
  }));

module.exports = User;
const Chat = require('./chat.js');

User.hasMany(Chat);
