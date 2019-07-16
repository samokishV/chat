const { validationResult } = require('express-validator');
const UserService = require('../services/userService.js');

exports.showRegisterForm = (req, res) => {
  res.render('registration.hbs', {
    title: 'Registration',
  });
};

exports.register = (req, res) => {
  let errors = validationResult(req);

  let { login } = req.body;
  let { password } = req.body;

  if (errors.isEmpty()) {
    UserService.create(login, password).then((user) => {
      res.cookie("user_id", user.id);
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

exports.showLoginForm = (req, res) => {
  res.render('login.hbs', {
    title: 'Log in',
  });
};

exports.login = (req, res) => {
  let errors = validationResult(req);

  let { login } = req.body;
  let { password } = req.body;

  if (errors.isEmpty()) {
    UserService.findByLogin(login).then((user) => {
      res.cookie("user_id", user.id);
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

exports.logout = (req, res) => {
  res.clearCookie("user_id");
  res.redirectToRoute('login');
};
