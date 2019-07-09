const MessageService = require('../services/messageService');
const ChatService = require('../services/chatService');

const {validationResult} = require('express-validator');

exports.index = async (request, response) => {
    let chatId = request.params["id"];

    let chat = await ChatService.findById(chatId);
    let pageTitle = chat.title;

    let messages = await MessageService.getByChatId(chatId);

    response.render("chatPage.hbs", {
        title: pageTitle,
        messages: messages,
        room: chatId
    });
};

exports.create = async (request, response) => {
    let chatId = request.params["id"];
    let userId = request.session.user_id;
    let message = request.body.message;

    const errors = validationResult(request);

    if (errors.isEmpty()) {
        MessageService.create(chatId, message, userId).then(async result => {
            let message = await MessageService.getById(result.id);
            response.send(message)
        });
    }
};

exports.getPartial = (request, response) => {
    let message = JSON.parse(request.body.message);

    response.render("partials/userMessage.hbs", {
        message: message,
        layout: false
    });
};

