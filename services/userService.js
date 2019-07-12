const bcrypt = require('bcrypt');
const User = require('../models/user.js');

const UserService = {};

/**
 * @param {string} login
 * @param {string} password
 * @returns Promise
 */
UserService.create = (login, password) => User.create({
  login,
  password,
});

/**
 * @param {string} login
 * @returns Promise
 */
UserService.loginExists = login => User.findOne({
  where: { login },
}).then((user) => {
  if (user) return true;
});

/**
 * @param {string} login
 * @param {string} password
 * @returns Promise
 */
UserService.passwordExists = async (login, password) => {
  let user = await UserService.findByLogin(login);
  if (user) {
    return UserService.passwordsIsEqual(password, user.password);
  }
};

/**
 * @param {string} password1
 * @param {string} password2
 * @returns Promise
 */
UserService.passwordsIsEqual = (password1, password2) => bcrypt.compare(password1, password2).then(res => res);

/**
 * @param {string} login
 * @returns Promise
 */
UserService.findByLogin = login => User.findOne({
  where: { login },
}).then(user => user);

/**
 * @param {number} id
 * @returns Promise
 */
UserService.findById = id => User.findOne({
  where: { id },
}).then(user => user);

module.exports = UserService;
