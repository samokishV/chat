const { validationResult } = require('express-validator');
const { htmlDecode } = require('js-htmlencode');
const decode = require('unescape');
const UserService = require('../services/userService.js');

exports.showRegisterForm = (req, res) => {
  res.render('registration.hbs', {
    title: 'Registration',
  });
};

exports.register = (req, res) => {
  const errors = validationResult(req);

  const { login } = req.body;
  const { password } = req.body;

  if (errors.isEmpty()) {
    UserService.create(login, password).then((user) => {
      res.cookie('user_id', user.id);
      res.redirectToRoute('chat');
    });
  } else {
    res.render('registration.hbs', {
      title: 'Registration',
      login: htmlDecode(decode(login)),
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
  const errors = validationResult(req);

  const { login } = req.body;
  const { password } = req.body;

  if (errors.isEmpty()) {
    UserService.findByLogin(login).then((user) => {
      res.cookie('user_id', user.id);
      res.redirectToRoute('chat');
    });
  } else {
    res.render('login.hbs', {
      title: 'Log in',
      login: htmlDecode(decode(login)),
      password,
      errors: errors.array(),
    });
  }
};

exports.logout = (req, res) => {
  res.clearCookie('user_id');
  res.redirectToRoute('login');
};
