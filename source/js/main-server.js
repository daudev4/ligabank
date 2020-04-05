'use strict';

(function () {
  var DOWNLOAD_URL = 'https://echo.htmlacademy.ru';
  var UPLOAD_URL = 'https://echo.htmlacademy.ru';
  var XHR_TIMEOUT = 10000;
  var HTTP_STATUS_OK = 200;

  var load = function (onSuccess, onError, url, data) {
    var httpMethod = data
      ? 'POST'
      : 'GET';
    var xhr = new XMLHttpRequest();

    xhr.responseType = 'json';
    xhr.addEventListener('load', function () {
      if (xhr.status === HTTP_STATUS_OK) {
        onSuccess(xhr.response);
      } else {
        onError('Статус ответа: ' + xhr.status + ' ' + xhr.statusText);
      }
    });
    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });
    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });

    xhr.timeout = XHR_TIMEOUT;

    xhr.open(httpMethod, url);
    xhr.send(data);
  };

  window.server = {
    load: load,
    DOWNLOAD_URL: DOWNLOAD_URL,
    UPLOAD_URL: UPLOAD_URL
  };

})();
