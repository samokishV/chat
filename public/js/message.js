$(document).ready(function() {
    const socket = io();
    const messageEl = $('#message');

    let roomName = $('#roomName').val();
    socket.emit('room', {room: roomName});

    $('form').submit(async function (e) {
        e.preventDefault();

        let message = messageEl.val();
        message = message.trim();

        if(message) {
            messageEl.removeClass('is-invalid');

            let type = 'POST';
            let href = $(this).attr('action');
            let str = $(this).serialize();

            let response = await request(type, href, str, function (result) {
                return result;
            });

            if (response) {
                socket.emit('messageCreate', {message: response, room: roomName});
            }
        } else {
            messageEl.addClass('is-invalid');
        }

        messageEl.val(' ');
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