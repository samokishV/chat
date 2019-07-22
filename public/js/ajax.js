/**
 * Makes Post, Delete request
 *
 * @param {string} type
 * @param {string} url
 * @param {object} requestData
 * @param successCallback
 * @returns {*|{getAllResponseHeaders, abort, setRequestHeader, readyState, getResponseHeader, overrideMimeType, statusCode}}
 */
function request(type, url, requestData, successCallback) {
    return $.ajax({
      headers: { 'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content') },
      type,
      url,
      data: requestData,
      success(responseData) {
        successCallback(responseData);
      },
      error(req, status, err) {
        alert('something went wrong', status, err);
      },
    });
  }
  