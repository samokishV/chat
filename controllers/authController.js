const { validationResult } = require('express-validator');
const UserService = require('../services/userService.js');

exports.create = (req, res) => {
  res.render('registration.hbs', {
    title: 'Registration',
  });
};

exports.store = (req, res) => {
  const errors = validationResult(req);

  const { login } = req.body;
  const { password } = req.body;

  if (errors.isEmpty()) {
    UserService.create(login, password).then((user) => {
      req.session.user_id = user.id;
      res.redirectToRoute('chat');
    });
  } else {
    res.render('registration.hbs', {
      title: 'Registration',
      login,
      password,
      errors: errors.array(),
    });
  }
};

exports.login = (req, res) => {
  res.render('login.hbs', {
    title: 'Log in',
  });
};

exports.auth = (req, res) => {
  const errors = validationResult(req);

  const { login } = req.body;
  const { password } = req.body;

  if (errors.isEmpty()) {
    UserService.findByLogin(login).then((user) => {
      req.session.user_id = user.id;
      res.redirectToRoute('chat');
    });
  } else {
    res.render('login.hbs', {
      title: 'Log in',
      login,
      password,
      errors: errors.array(),
    });
  }
};
