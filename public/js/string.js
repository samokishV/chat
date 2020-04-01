/**
   *
   * @param {string} str
   */
function decodeString(str) {
  const map = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#039;': "'",
  };
  return str.replace(/&amp;|&lt;|&gt;|&quot;|&#039;/g, m => map[m]);
}

/**
   *
   * @param {string} str
   */
function encodeString(str) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '""': '&quot;',
    "'": '&#039;',
  };
  return str.replace(/&|<|>|""|'/g, m => map[m]);
}
