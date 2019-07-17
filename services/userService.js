const bcrypt = require('bcrypt');
const User = require('../models/user.js');
const logger = require('../logger.js');

const UserService = {};

/**
 * @param {string} login
 * @param {string} password
 * @returns Promise
 */
UserService.create = (login, password) => User.create({
  login,
  password,
}).catch(
  (err) => {
    console.log(err);
    logger.error(`Error creating user: login ${login}, password ${password} in UserService.create()`);
  },
);

/**
 * @param {string} login
 * @returns Promise
 */
UserService.loginExists = login => User.findOne({
  where: { login },
}).then((user) => {
  if (user) return true;
}).catch(
  (err) => {
    console.log(err);
    logger.error(`Error finding user: login ${login} in UserService.loginExists()`);
  },
);

/**
 * @param {string} login
 * @param {string} password
 * @returns Promise
 */
UserService.passwordExists = async (login, password) => {
  const user = await UserService.findByLogin(login);
  if (user) {
    return UserService.passwordsIsEqual(password, user.password);
  }
};

/**
 * @param {string} password1
 * @param {string} password2
 * @returns Promise
 */
UserService.passwordsIsEqual = (password1, password2) => bcrypt.compare(password1, password2)
  .then(res => res)
  .catch(
    (err) => {
      console.log(err);
      logger.error('Error comparing passwords in UserService.passwordsIsEqual()');
    },
  );

/**
 * @param {string} login
 * @returns Promise
 */
UserService.findByLogin = login => User.findOne({
  where: { login },
}).then(user => user)
  .catch(
    (err) => {
      console.log(err);
      logger.error(`Error finding user: login ${login} in UserService.findByLogin()`);
    },
  );

/**
 * @param {number} id
 * @returns Promise
 */
UserService.findById = id => User.findOne({
  where: { id },
}).then(user => user)
  .catch(
    (err) => {
      console.log(err);
      logger.error(`Error finding user: id ${id} in UserService.findById()`);
    },
  );

module.exports = UserService;
