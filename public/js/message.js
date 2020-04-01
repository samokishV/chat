$(document).ready(() => {
  const socket = io();
  const messageEl = $('#message');

  const roomName = $('#roomName').val();
  socket.emit('room', { room: roomName });

  // eslint-disable-next-line no-undef
  $('form').submit(async (e) => {
    e.preventDefault();
    const ifConnected = checkConnection(messageEl);

    if (ifConnected) {
      let message = messageEl.val();
      message = message.trim();

      if (message) {
        messageEl.removeClass('is-invalid');
        socket.emit('messageCreate', { message, id: roomName });
      } else {
        messageEl.addClass('is-invalid');
      }

      messageEl.val(' ');
    }

    return false;
  });

  socket.on('messageAdd', async (data) => {
    const holderElem = $('table');
    View.messageAdd(holderElem, data);
  });

  socket.on('chatDelete', (data) => {
    if (roomName === data.id) {
      alert('Chat was closed!');
      window.location.href = '/chat';
    }
  });

  setInterval(() => { checkConnection(messageEl); }, 3000);
});
