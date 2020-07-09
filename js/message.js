'use strict';

window.message = (function () {
  var main = document.querySelector('main');

  function Message(name) {
    var messageTemplate = document.querySelector('#' + name).content.querySelector('.' + name);
    var message = messageTemplate.cloneNode(true);
    var messageButton = message.querySelector('.' + name + '__button');
    main.append(message);

    message.addEventListener('click', function (evt) {
      if (evt.target === evt.currentTarget) {
        closeMessageModal();
      }
    });
    messageButton.addEventListener('click', function () {
      closeMessageModal();
    });

    function messageEscPressHandler(evt) {
      window.utils.isEscEvent(evt, closeMessageModal);
    }

    function closeMessageModal() {
      message.classList.add('hidden');
      document.removeEventListener('keydown', messageEscPressHandler);
    }

    this.showMessage = function () {
      message.classList.remove('hidden');
      document.addEventListener('keydown', messageEscPressHandler);
    };
  }

  var success = new Message('success');
  var error = new Message('error');

  return {
    showSuccess: success.showMessage,
    showError: error.showMessage
  };
})();
