$(document).ready(() => {
  const socket = io();
  const messageEl = $('#message');

  const roomName = $('#roomName').val();
  socket.emit('room', { room: roomName });

  $('form').submit(async function (e) {
    e.preventDefault();

    let message = messageEl.val();
    message = message.trim();

    if (message) {
      messageEl.removeClass('is-invalid');

      const type = 'POST';
      const href = $(this).attr('action');
      const str = $(this).serialize();

      const response = await request(type, href, str, result => result);

      if (response) {
        socket.emit('messageCreate', { message: response, room: roomName });
      }
    } else {
      messageEl.addClass('is-invalid');
    }

    messageEl.val(' ');
    return false;
  });

  socket.on('messageAdd', async (data) => {
    const message = JSON.stringify(data.message);

    const type = 'POST';
    const href = '/message-row-template';
    const str = { message };

    const response = await request(type, href, str, result => result);

    $('table').append(response);
  });

  socket.on('chatDelete', (data) => {
    alert('Chat was closed!');
    window.location.href = '/chat';
  });
});
