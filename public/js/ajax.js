/**
 * Makes Post, Delete request
 *
 * @param {string} type
 * @param {string} url
 * @param {object} data
 * @param successCallback
 * @returns {*|{getAllResponseHeaders, abort, setRequestHeader, readyState, getResponseHeader, overrideMimeType, statusCode}}
 */
function request(type, url, data, successCallback) {
  return $.ajax({
    headers: { 'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content') },
    type,
    url,
    data,
    success(data) {
      successCallback(data);
    },
    error(req, status, err) {
      alert('something went wrong', status, err);
    },
  });
}
