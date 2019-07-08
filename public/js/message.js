$(document).ready(function() {
    const socket = io();
    const message = $('#message');

    let roomName = $('#roomName').val();
    socket.emit('room', {room: roomName});

    $('form').submit(async function (e) {
        e.preventDefault();

        let type = 'POST';
        let href = $(this).attr('action');
        let str = $(this).serialize();

        let response = await request(type, href, str, function (result) {
            return result;
        });

        if (response) {
            socket.emit('messageCreate', {message: response, room: roomName});
        }

        message.val(' ');
        return false;
    });

    socket.on('messageAdd', async function(data) {
        let message = JSON.stringify(data.message);

        let type = 'POST';
        let href = '/message-row-template';
        let str = {message: message};

        let response = await request(type, href, str, function(result) {
            return result;
        });

        $("table").append(response);
    });

    socket.on('chatDelete', function(data) {
        alert('Chat was closed!');
        window.location.href = '/chat';
    });
});