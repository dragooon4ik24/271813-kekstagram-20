'use strict';

(function () {
  var Effects = {
    NONE: 'none',
    CHROME: 'chrome',
    SEPIA: 'sepia',
    MARVIN: 'marvin',
    PHOBOS: 'phobos',
    HEAT: 'heat',
  };
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
    resetForm();
  }

  function openUploadOverlay() {
    uploadOverlay.classList.remove('hidden');
    document.body.classList.add('modal-open');
    document.addEventListener('keydown', uploadOverlayEscPressHandler);
    if (!rightEdge) {
      rightEdge = line.offsetWidth;
    }
    resetEffect();
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

  var listEffects = uploadForm.querySelector('.effects__list');
  var defaulfEffect = uploadOverlay.querySelector('.effects__radio');
  var currentEffect = Effects.NONE;

  listEffects.addEventListener('click', function (evt) {
    var target = evt.target;
    if (target.classList.contains('effects__radio')) {
      currentEffect = target.value;
      uploadPreview.classList = '';
      uploadPreview.classList.add('effects__preview--' + currentEffect);
      if (currentEffect === Effects.NONE) {
        slider.classList.add('hidden');
      } else if (slider.classList.contains('hidden')) {
        slider.classList.remove('hidden');
      }
      changeEffect(rightEdge);
    }
  });

  function resetForm() {
    uploadFile.value = '';
    textHashtags.value = '';
    textDescription.value = '';
    uploadPreview.classList = '';
    defaulfEffect.checked = true;
    changeValueScale(MAX_VALUE_SCALE);
  }

  var slider = uploadOverlay.querySelector('.effect-level');
  var sliderValue = uploadOverlay.querySelector('.effect-level__value');
  var line = uploadOverlay.querySelector('.effect-level__line');
  var pin = slider.querySelector('.effect-level__pin');
  var depth = slider.querySelector('.effect-level__depth');
  var rightEdge = 0;

  pin.addEventListener('mousedown', function (evt) {
    evt.preventDefault();
    var shiftX = evt.clientX - pin.getBoundingClientRect().left;

    var mouseMoveHandler = function (moveEvt) {
      moveEvt.preventDefault();
      var newLeft = moveEvt.clientX - shiftX - line.getBoundingClientRect().left + pin.offsetWidth / 2;
      if (newLeft < 0) {
        newLeft = 0;
      }
      if (newLeft > rightEdge) {
        newLeft = rightEdge;
      }
      changeEffect(newLeft);
    };

    var mouseUpHandler = function (upEvt) {
      upEvt.preventDefault();

      document.removeEventListener('mousemove', mouseMoveHandler);
      document.removeEventListener('mouseup', mouseUpHandler);
    };

    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', mouseUpHandler);
  });

  function changeEffect(position) {
    var value = position / rightEdge;
    var valuePercent = value * 100;

    sliderValue.setAttribute('value', valuePercent);
    pin.style.left = position + 'px';
    depth.style.width = valuePercent + '%';

    switch (currentEffect) {
      case Effects.CHROME:
        uploadPreview.style.filter = 'grayscale(' + value + ')';
        break;
      case Effects.SEPIA:
        uploadPreview.style.filter = 'sepia(' + value + ')';
        break;
      case Effects.MARVIN:
        uploadPreview.style.filter = 'invert(' + valuePercent + '%)';
        break;
      case Effects.PHOBOS:
        uploadPreview.style.filter = 'blur(' + value * 3 + 'px)';
        break;
      case Effects.HEAT:
        uploadPreview.style.filter = 'brightness(' + (value * 2 + 1) + ')';
        break;
      case Effects.NONE:
        uploadPreview.style.filter = '';
        break;
    }
  }

  function resetEffect() {
    slider.classList.add('hidden');
    currentEffect = Effects.NONE;
    changeEffect(rightEdge);
  }

  uploadForm.addEventListener('submit', function (evt) {
    evt.preventDefault();
    window.backend.unload(new FormData(uploadForm), successHandler, errorHandler);
  });

  function successHandler() {
    closeUploadOverlay();
    window.message.showSuccess();
  }

  function errorHandler() {
    closeUploadOverlay();
    window.message.showError();
  }
})();
