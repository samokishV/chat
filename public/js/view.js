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
}