const ChatService = require('../services/chatService.js');
const UserService = require('../services/userService.js');

const {validationResult} = require('express-validator');

exports.index = async (request, response) => {
    let chats = await ChatService.getFullInfo();

    let userId = request.session.user_id;
    let user = await UserService.findById(userId);

    response.render("chat.hbs", {
        title: "Chats",
        chats: chats,
        login: user.login,
    });
};

exports.create = async (request, response) => {
    let title = request.body.title;
    let userId = request.session.user_id;

    const errors = validationResult(request);

    if (errors.isEmpty()) {
        ChatService.create(title, userId).then(async result => {
            let chat = await ChatService.findById(result.id);
            response.send(chat);
        });
    }
};

exports.delete = async(request, response) => {
    let chatId = request.params["id"];

    ChatService.deleteById(chatId).then(
        response.send({id: chatId})
    );
};

exports.getPartial = (request, response) => {
    let chat = JSON.parse(request.body.chat);
    let login = request.body.login;

    response.render("partials/chat.hbs", {
        chat: chat,
        login: login,
        layout: false
    });
};


