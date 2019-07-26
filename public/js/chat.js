$(() => {
  const socket = io();
  const titleEl = $('#title');

  $('form').submit(async function (e) {
    e.preventDefault();

    const ifConnected = checkConnection(titleEl);

    if(ifConnected) {    
      let title = titleEl.val();
      title = title.trim();

      if (title) {
        titleEl.removeClass('is-invalid');
        socket.emit('chatCreate', {title: title});
      } else {
        titleEl.addClass('is-invalid');
      }

      titleEl.val(' ');
    }

    return false;
  });

  socket.on('chatAdd', async (data) => {
    const login = document.getElementById('login').innerText;
    const holderElem = $('table');
    View.chatAdd(holderElem, data, login);
  });

  $('#chats').on('click', '.chatDelete', async function (e) {
    e.preventDefault();

    let id = $(this).closest("tr").attr("id");
    id = id.replace(/tr/, ''); 

    socket.emit('chatRemove', {id: id});

    return false;
  });

  socket.on('chatDelete', (data) => {
    $(`#tr${data.id}`).remove();
  });

  socket.on('messageAddGlobal', (data) => {
    const chatId  = data.chatId;
    const numberEl = $(`#tr${chatId} .number`);
    const count = parseInt(numberEl[0].innerText);

    numberEl[0].innerHTML = count + 1;
  });

  if (performance.navigation.type === 2) {
    location.reload(true);
  }

  setInterval(() => {checkConnection(titleEl)}, 3000);  
});
