'use strict';

window.utils = (function () {
  var KEY_NAME_ESC = 'Escape';
  var KEY_NAME_ENTER = 'Enter';
  return {
    randomInteger: function (min, max) {
      var rand = min + Math.random() * (max + 1 - min);
      return Math.floor(rand);
    },
    shuffleArray: function (array) {
      var shuffledArray = array.slice();
      var length = shuffledArray.length;
      var randomIndex;
      var temp;
      while (length) {
        randomIndex = Math.floor(Math.random() * length--);
        temp = shuffledArray[length];
        shuffledArray[length] = shuffledArray[randomIndex];
        shuffledArray[randomIndex] = temp;
      }

      return shuffledArray;
    },
    isEscEvent: function (evt, action) {
      if (evt.key === KEY_NAME_ESC) {
        action();
      }
    },
    isEnterEvent: function (evt, action) {
      if (evt.key === KEY_NAME_ENTER) {
        action();
      }
    }
  };
})();
