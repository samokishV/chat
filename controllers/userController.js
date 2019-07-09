const UserService = require('../services/userService.js');
const {validationResult} = require('express-validator');

exports.create = (request, response) => {
    response.render("registration.hbs", {
        title: "Registration"
    });
};

exports.store = (request, response) => {
    const errors = validationResult(request);

    let login = request.body.login;
    let password = request.body.password;

    if (errors.isEmpty()) {
        UserService.create(login, password).then(user => {
            request.session.user_id = user.id;
            response.redirectToRoute("chat");
        });
    } else {
        response.render("registration.hbs", {
            title: "Registration",
            login: login,
            password: password,
            errors: errors.array()
        });
    }
};

exports.login = (request, response) => {
    response.render("login.hbs", {
        title: "Log in"
    });
};

exports.auth = (request, response) => {
    const errors = validationResult(request);

    let login = request.body.login;
    let password = request.body.password;

    if (errors.isEmpty()) {
        UserService.findByLogin(login).then(user => {
            request.session.user_id = user.id;
            response.redirectToRoute("chat");
        })
    } else {
        response.render("login.hbs", {
            title: "Log in",
            login: login,
            password: password,
            errors: errors.array()
        });
    }
};
