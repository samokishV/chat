/**
 *
 * @param {object} holderElem
 * @return {boolean}
 */
function checkConnection(holderElem) {
  const ifConnected = window.navigator.onLine;
  if (ifConnected) {
    const invalid = $(holderElem).hasClass('is-invalid');
    const valid = !invalid;

    if (valid) {
      $(holderElem).removeClass('red-border');
    }

    $('#connection').css('display', 'none');
    return true;
  }
  $(holderElem).addClass('red-border');
  $('#connection').css('display', 'block');
  return false;
}
