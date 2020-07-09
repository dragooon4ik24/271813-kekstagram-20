'use strict';

window.backend = (function () {
  var StatusCode = {
    OK: 200
  };

  function load(onSuccess) {
    var URL = 'https://javascript.pages.academy/kekstagram/data';
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.open('GET', URL);

    xhr.addEventListener('load', function () {
      onSuccess(xhr.response);
    });

    xhr.send();
  }

  function unload(data, onSuccess, onError) {
    var URL = 'https://javascript.pages.academy/kekstagram';
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      if (xhr.status === StatusCode.OK) {
        onSuccess();
      } else {
        onError();
      }
    });

    xhr.open('POST', URL);
    xhr.send(data);
  }

  return {
    load: load,
    unload: unload
  };
})();
