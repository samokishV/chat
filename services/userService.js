const User = require('../models/user.js');
const bcrypt = require("bcrypt");

const UserService = {};

/**
 * @param {string} login
 * @param {string} password
 * @returns Promise
 */
UserService.create = function(login, password) {
    return User.create({
        login: login,
        password: password
    });
};

/**
 * @param {string} login
 * @returns Promise
 */
UserService.loginExists = function(login) {
    return User.findOne({
        where: {login: login}
    }).then(user=> {
        if(user) return true;
    });
};

/**
 * @param {string} login
 * @param {string} password
 * @returns Promise
 */
UserService.passwordExists = async function(login, password) {
    let user = await UserService.findByLogin(login);
    if(user) {
        return UserService.passwordsIsEqual(password, user.password);
    }
};

/**
 * @param {string} password1
 * @param {string} password2
 * @returns Promise
 */
UserService.passwordsIsEqual = function(password1, password2) {
    return bcrypt.compare(password1, password2).then(res => {
        return res;
    });
};

/**
 * @param {string} login
 * @returns Promise
 */
UserService.findByLogin = function(login) {
    return User.findOne({
        where: {login: login}
    }).then(user=> {
        return user;
    });
};

/**
 * @param {number} id
 * @returns Promise
 */
UserService.findById = function(id) {
    return User.findOne({
        where: {id: id}
    }).then(user=> {
        return user;
    });
};

module.exports = UserService;
