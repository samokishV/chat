class View {
  /**
   * 
   * @param {object} holder_elem 
   * @param {Message} obj 
   */
  static messageAdd(holder_elem, obj) {
    let output;

    output = `
    <tr>
        <td>${obj.createdAt}</td>
        <td>${obj.user.login}</td>
        <td>${obj.message}</td>
    </tr>`;

    $(holder_elem).append(output);
  }

  /**
   * 
   * @param {object} holder_elem 
   * @param {Chat} chat 
   * @param {string} login
   */
  static chatAdd(holder_elem, chat, login) {
    let output;

    output = `
    <tr id="tr${chat.id}">
      <td>${chat.id}</td>
      <td>
        <a class="room-name" href="/chat/${chat.id}">
            ${chat.title}
        </a>
      </td>
      <td>${chat.user.login}</td>
      <td class="number">`;
      if(chat.count) {
        output += chat.messages.length;
      } else {
        output += 0;
      }

      output += `
      </td>
      <td>${chat.createdAt}</td>
      <td>`;

      if(chat.user.login === login)
        output += `<a class="chatDelete" href="/chat/${chat.id}"> Delete </a>`;
      
      output += `
      </td>
    </tr>`;

    $(holder_elem).append(output);
  }
}