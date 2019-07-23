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

      request(type, href, str, result => result);
    } else {
      titleEl.addClass('is-invalid');
    }

    titleEl.val(' ');

    return false;
  });

  socket.on('chatAdd', async (data) => {
    const login = document.getElementById('login').innerText;
    const holderElem = $('table');
    View.chatAdd(holderElem, data, login);
  });

  $('#chats').on('click', '.chatDelete', async function (e) {
    e.preventDefault();

    const type = 'DELETE';
    const href = $(this).attr('href');
    const str = {};

    request(type, href, str, result => result);

    return false;
  });

  socket.on('chatDelete', (data) => {
    $(`#tr${data}`).remove();
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
