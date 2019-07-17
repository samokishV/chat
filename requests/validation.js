const { check } = require('express-validator');
const UserService = require('../services/userService.js');
const logger = require('../logger.js');

exports.registration = [
  check('login')
    .trim()
    .escape()
    .not()
    .isEmpty()
    .withMessage('Login shouldn\'t be empty')
    .custom(login => UserService.loginExists(login).then((user) => {
      if (user) return Promise.reject();
    }))
    .withMessage('Login already registered'),

  check('password')
    .isLength({ min: 5 })
    .withMessage('Your password must be at least 5 characters'),
];

exports.login = [
  check('login')
    .trim()
    .escape()
    .custom(login => UserService.loginExists(login).then((user) => {
      if (!user) return Promise.reject();
    }))
    .withMessage('Login doesn\'t exists'),

  check('password')
    .custom((password, { req }) => {
      const { login } = req.body;
      return UserService.passwordExists(login, password).then((user) => {
        if (!user) {
          return Promise.reject();
        }
      });
    })
    .withMessage('Wrong password'),
];

exports.chatStore = [
  check('title')
    .trim()
    .escape()
    .not()
    .isEmpty(),
];

exports.messageStore = [
  check('message')
    .trim()
    .escape()
    .not()
    .isEmpty(),
];

exports.chatTableRowData = (req, res, next) => {
  if (!req.body.login) {
    console.log('login is required');
    logger.error('Error adding row to chat table. Login is required in chatController.renderTableRow()');
  } else {
    try {
      JSON.parse(req.body.chat);
      return next();
    } catch (e) {
      console.log('not JSON chat');
      logger.error('Error adding row to chat table. JSON data is required in chatController.renderTableRow()');
    }
  }
};

// eslint-disable-next-line consistent-return
exports.messageTableRowData = (req, res, next) => {
  try {
    JSON.parse(req.body.message);
    return next();
  } catch (e) {
    console.log('not JSON message');
    logger.error('Error adding row to message table. JSON data is required in messageController.renderTableRow()');
  }
};
