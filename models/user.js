const Sequelize = require("sequelize");
const sequelize = require("./dbConnect");
const bcrypt = require("bcrypt");

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

module.exports = User;
const Chat = require("./chat.js");
User.hasMany(Chat);



