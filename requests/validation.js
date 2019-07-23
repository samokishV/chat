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