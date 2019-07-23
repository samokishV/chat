class View {
  /**
   *
   * @param {object} holderElem
   * @param {Message} obj
   */
  static messageAdd(holderElem, obj) {
    const output = `
    <tr>
        <td>${obj.createdAt}</td>
        <td>${obj.user.login}</td>
        <td>${obj.message}</td>
    </tr>`;

    $(holderElem).append(output);
  }

  /**
   *
   * @param {object} holderElem
   * @param {Chat} chat
   * @param {string} login
   */
  static chatAdd(holderElem, chat, login) {
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
    if (chat.count) {
      output += chat.messages.length;
    } else {
      output += 0;
    }

    output += `
      </td>
      <td>${chat.createdAt}</td>
      <td>`;

    if (chat.user.login === login) output += `<a class="chatDelete" href="/chat/${chat.id}"> Delete </a>`;

    output += `
      </td>
    </tr>`;

    $(holderElem).append(output);
  }
}
