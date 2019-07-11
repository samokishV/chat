const { validationResult } = require('express-validator');
const UserService = require('../services/userService.js');

exports.create = (request, response) => {
  response.render('registration.hbs', {
    title: 'Registration',
  });
};

exports.store = (request, response) => {
  const errors = validationResult(request);

  const { login } = request.body;
  const { password } = request.body;

  if (errors.isEmpty()) {
    UserService.create(login, password).then((user) => {
      request.session.user_id = user.id;
      response.redirectToRoute('chat');
    });
  } else {
    response.render('registration.hbs', {
      title: 'Registration',
      login,
      password,
      errors: errors.array(),
    });
  }
};

exports.login = (request, response) => {
  response.render('login.hbs', {
    title: 'Log in',
  });
};

exports.auth = (request, response) => {
  const errors = validationResult(request);

  const { login } = request.body;
  const { password } = request.body;

  if (errors.isEmpty()) {
    UserService.findByLogin(login).then((user) => {
      request.session.user_id = user.id;
      response.redirectToRoute('chat');
    });
  } else {
    response.render('login.hbs', {
      title: 'Log in',
      login,
      password,
      errors: errors.array(),
    });
  }
};
