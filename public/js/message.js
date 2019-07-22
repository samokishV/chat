$(document).ready(() => {
  const socket = io();
  const messageEl = $('#message');

  const roomName = $('#roomName').val();
  socket.emit('room', { room: roomName });

  // eslint-disable-next-line no-undef
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
        const holder_elem = $("table");
        View.messageAdd(holder_elem, response);
      }
    } else {
      messageEl.addClass('is-invalid');
    }

    messageEl.val(' ');
    return false;
  });

  socket.on('messageAdd', async (data) => {
    const holder_elem = $("table");
    View.messageAdd(holder_elem, data.message);
  });

  socket.on('chatDelete', (data) => {
    if(roomName === data.id) {
      alert('Chat was closed!');
      window.location.href = '/chat';
    }
  });
});

