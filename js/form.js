'use strict';

window.form = (function () {
  var STEP_SCALE = 25;
  var MIN_VALUE_SCALE = 25;
  var MAX_VALUE_SCALE = 100;
  var MAX_COUNT_HASHTAGS = 5;
  var MAX_LENGTH_HASHTAG = 20;

  var REGEXP_SPACES_SYMBOLS = /\s+/;
  var REGEXP_LETTERS_AND_NUMBERS = /^#[a-zA-Zа-яА-Яё\d]+$/;

  var uploadForm = document.querySelector('.img-upload__form');
  var uploadFile = uploadForm.querySelector('#upload-file');
  var uploadOverlay = uploadForm.querySelector('.img-upload__overlay');
  var closeButtonUploadOverlay = uploadOverlay.querySelector('.img-upload__cancel');

  uploadFile.addEventListener('change', function () {
    openUploadOverlay();
  });

  closeButtonUploadOverlay.addEventListener('click', function () {
    closeUploadOverlay();
  });

  function uploadOverlayEscPressHandler(evt) {
    window.utils.isEscEvent(evt, closeUploadOverlay);
  }

  function closeUploadOverlay() {
    uploadOverlay.classList.add('hidden');
    document.body.classList.remove('modal-open');
    document.removeEventListener('keydown', uploadOverlayEscPressHandler);
    uploadFile.value = '';
  }

  function openUploadOverlay() {
    uploadOverlay.classList.remove('hidden');
    document.body.classList.add('modal-open');
    document.addEventListener('keydown', uploadOverlayEscPressHandler);
  }

  var uploadPreview = uploadOverlay.querySelector('.img-upload__preview img');
  var increaseScaleButton = uploadOverlay.querySelector('.scale__control--bigger');
  var decreaseScaleButton = uploadOverlay.querySelector('.scale__control--smaller');
  var scaleValue = uploadOverlay.querySelector('.scale__control--value');

  function changeValueScale(value) {
    scaleValue.value = value + '%';
    uploadPreview.style.transform = 'scale(' + value / 100 + ')';
  }

  decreaseScaleButton.addEventListener('click', function () {
    var value = parseInt(scaleValue.value, 10);
    if (value > MIN_VALUE_SCALE) {
      value -= STEP_SCALE;
      changeValueScale(value);
    }
  });

  increaseScaleButton.addEventListener('click', function () {
    var value = parseInt(scaleValue.value, 10);
    if (value < MAX_VALUE_SCALE) {
      value += STEP_SCALE;
      changeValueScale(value);
    }
  });
  var textHashtags = uploadOverlay.querySelector('.text__hashtags');
  var textDescription = uploadOverlay.querySelector('.text__description');

  function getErrorMessage(stringHashtags) {
    var errorMessage = '';
    if (!stringHashtags) {
      return errorMessage;
    }
    var arrHashtags = stringHashtags.trim().split(REGEXP_SPACES_SYMBOLS);
    var objectHashtag = {};
    if (arrHashtags.length > MAX_COUNT_HASHTAGS) {
      errorMessage = 'Количество хештегов больше ' + MAX_COUNT_HASHTAGS;
      return errorMessage;
    }
    var valid = arrHashtags.every(function (el) {
      var hashtag = el.toLowerCase();
      if (hashtag.length > MAX_LENGTH_HASHTAG) {
        errorMessage =
          'Хештег не может быть длиннее ' + MAX_LENGTH_HASHTAG + ' символов.';
        return false;
      } else if (REGEXP_LETTERS_AND_NUMBERS.test(hashtag)) {
        objectHashtag[hashtag] = true;
        return true;
      } else if (!hashtag.startsWith('#')) {
        errorMessage = 'Хештег должен начинаться со знака решетки.';
        return false;
      } else if (hashtag.length < 2) {
        errorMessage = 'Хештег не может состоять только из знака решетки.';
        return false;
      } else if (hashtag.includes('#', 1)) {
        errorMessage = 'Разделите хештеги пробелами.';
        return false;
      } else {
        errorMessage =
          'Хештеги содержат недопустимые спецсимволы. Используйте только буквы и цифры.';
        return false;
      }
    });
    if (valid && Object.keys(objectHashtag).length !== arrHashtags.length) {
      errorMessage = 'Один и тот же хэш-тег не может быть использован дважды.';
    }
    return errorMessage;
  }
  textHashtags.addEventListener('input', function (evt) {
    var errorMessage = getErrorMessage(textHashtags.value);
    if (errorMessage) {
      textHashtags.setCustomValidity(errorMessage);
      evt.preventDefault();
    } else {
      textHashtags.setCustomValidity('');
    }
  });

  function addHandlingTextField(field) {
    field.addEventListener('focus', function () {
      document.removeEventListener('keydown', uploadOverlayEscPressHandler);
    });
    field.addEventListener('blur', function () {
      document.addEventListener('keydown', uploadOverlayEscPressHandler);
    });
  }

  addHandlingTextField(textHashtags);
  addHandlingTextField(textDescription);
})();
