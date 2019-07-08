$(function () {
    const socket = io();
    const title = $('#title');

    $('form').submit(async function(e){
        e.preventDefault();

        let type = 'POST';
        let href = $(this).attr('action');
        let str = $(this).serialize();

        let response = await request(type, href, str, function(result) {
            return result;
        });

        if(response) {
            socket.emit('chatCreate', {chat: response});
        }

        title.val(' ');
    });

    socket.on('chatAdd', async function(data){
        let login = document.getElementById('login').innerText;
        let chat = data.chat;

        let type = 'POST';
        let href = '/chat-row-template';
        let str = {login: login, chat: JSON.stringify(chat)};

        let response = await request(type, href, str, function(result) {
            return result;
        });

        $("table").append(response);
    });

    $('#chats').on('click', '.chatDelete', async function(e) {
        e.preventDefault();

        let type = 'DELETE';
        let href = $(this).attr('href');
        let str = {};

        let response = await request(type, href, str, function(result) {
            return result;
        });

        if(response) {
            socket.emit('chatRemove', {id: response.id});
        }

        return false;
    });

    socket.on('chatDelete', function(data) {
        $("#tr"+data.id).remove();
    });

    socket.on('messageAddGlobal', function(data) {
        let chatId = data.message.chatId;
        let numberEl = $("#tr"+ chatId +" .number");
        let count = parseInt(numberEl[0].innerText);

        numberEl[0].innerHTML = count + 1;
    });
});