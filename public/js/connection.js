/**
 * 
 * @param {object} holderElem 
 * @return {boolean}
 */
function checkConnection(holderElem) {
  var ifConnected = window.navigator.onLine;
  if (ifConnected) {
    const invalid = $(holderElem).hasClass('is-invalid');
    const valid = !invalid;

    if(valid) {
      $(holderElem).removeClass('red-border');         
    }

    $('#connection').css('display', 'none');
    return true;
  } else {
    $(holderElem).addClass('red-border');
    $('#connection').css('display', 'block');
    return false;
  }
} 