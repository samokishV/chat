$(() => {
  const socket = io();
  const titleEl = $('#title');

  $('form').submit(async function (e) {
    e.preventDefault();

    let title = titleEl.val();
    title = title.trim();

    if (title) {
      titleEl.removeClass('is-invalid');

      const type = 'POST';
      const href = $(this).attr('action');
      const str = $(this).serialize();

      const response = await request(type, href, str, result => result);

      if (response) {
        socket.emit('chatCreate', { chat: response });
        const holder_elem = $("table");
        const login = document.getElementById('login').innerText;
        View.chatAdd(holder_elem, response, login);
      }
    } else {
      titleEl.addClass('is-invalid');
    }

    titleEl.val(' ');

    return false;
  });

  socket.on('chatAdd', async (data) => {
    const login = document.getElementById('login').innerText;
    const holder_elem = $("table");
    View.chatAdd(holder_elem, data.chat, login);
  });

  $('#chats').on('click', '.chatDelete', async function (e) {
    e.preventDefault();

    const type = 'DELETE';
    const href = $(this).attr('href');
    const str = {};

    const response = await request(type, href, str, result => result);

    if (response) {
      socket.emit('chatRemove', { id: response.id });
    }

    return false;
  });

  socket.on('chatDelete', (data) => {
    $(`#tr${data.id}`).remove();
  });

  socket.on('messageAddGlobal', (data) => {
    const { chatId } = data.message;
    const numberEl = $(`#tr${chatId} .number`);
    const count = parseInt(numberEl[0].innerText);

    numberEl[0].innerHTML = count + 1;
  });

  if (performance.navigation.type === 2) {
    location.reload(true);
  }
});
