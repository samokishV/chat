const Sequelize = require("sequelize");
const bcrypt = require("bcrypt");

const sequelize = new Sequelize("chat_db", "samokish", "qwerty", {
    dialect: "mysql",
    host: "localhost",
});

const User = sequelize.define("user", {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    login: {
        type: Sequelize.STRING,
        allowNull: false
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

sequelize.sync().then(result => console.log("User schema created successfully."))
    .catch( err=> console.log(err));

User.beforeCreate((user, options) => {

    return bcrypt.hash(user.password, 10)
        .then(hash => {
            user.password = hash;
        })
        .catch(err => {
            throw new Error();
        });
});

/**
 * @param {string} login
 * @returns Promise
 */
User.loginExists = function(login) {
    return User.findOne({where: {login: login}}).then(user=> {
        if(user) return true;
    });
};

/**
 * @param {string} login
 * @param {string} password
 * @returns Promise
 */
User.passwordExists = async function(login, password) {
    let user = await User.findByLogin(login);
    if(user) {
        return User.passwordsIsEqual(password, user.password);
    }
};

/**
 * @param {string} password1
 * @param {string} password2
 * @returns Promise
 */
User.passwordsIsEqual = function(password1, password2) {
    return bcrypt.compare(password1, password2).then(res => {
        return res;
    });
};

/**
 * @param {string} login
 * @returns Promise
 */
User.findByLogin = function(login) {
    return User.findOne({where: {login: login}}).then(user=> {
        return user;
    });
};

module.exports = User;

