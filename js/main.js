'use strict';

var COUNT_PHOTOS = 25;
var MIN_COUNT_LIKES = 15;
var MAX_COUNT_LIKES = 200;
var MIN_COUNT_COMMENTS = 3;
var MAX_COUNT_COMMENTS = 20;
var MIN_COUNT_SENTENCES = 1;
var MAX_COUNT_SENTENCES = 2;
var MIN_NUMBER_AVATAR = 1;
var MAX_NUMBER_AVATAR = 6;
var STEP_SCALE = 25;
var MIN_VALUE_SCALE = 25;
var MAX_VALUE_SCALE = 100;
var MAX_COUNT_HASHTAGS = 5;
var MAX_LENGTH_HASHTAG = 20;
var COMMENTS = [
  'Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!',
];
var NAMES = [
  'Ваня',
  'Антонина',
  'Серега',
  'Иннокентий',
  'Вера',
  'Надежда',
  'Любовь',
];

var KEY_NAME_ESCAPE = 'Escape';
var REGEXP_SPACES_SYMBOLS = /\s+/;
var REGEXP_LETTERS_AND_NUMBERS = /^#[a-zA-Zа-яА-Яё\d]+$/;

function randomInteger(min, max) {
  var rand = min + Math.random() * (max + 1 - min);
  return Math.floor(rand);
}

function shuffleArray(array) {
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
}

function createArrPhotos(count) {
  var photos = [];
  var arrIndexPhotos = [];
  for (var i = 0; i < count; i++) {
    arrIndexPhotos[i] = i + 1;
  }
  var shuffledArrIndexPhotos = shuffleArray(arrIndexPhotos);
  photos = shuffledArrIndexPhotos.map(function (el) {
    return createDataPhoto(el);
  });

  return photos;
}

function createDataPhoto(number) {
  var data = {};
  data.url = 'photos/' + number + '.jpg';
  data.description = '';
  data.likes = randomInteger(MIN_COUNT_LIKES, MAX_COUNT_LIKES);
  data.comments = createArrComments(randomInteger(MIN_COUNT_COMMENTS, MAX_COUNT_COMMENTS));
  return data;
}

function createMessage() {
  var shuffledMessages = shuffleArray(COMMENTS);
  var countSentences = randomInteger(MIN_COUNT_SENTENCES, MAX_COUNT_SENTENCES);
  var arrMessage = shuffledMessages.slice(0, countSentences);
  var message = arrMessage.length === 1 ? arrMessage[0] : arrMessage[0] + ' ' + arrMessage[1];
  return message;
}

function createComment() {
  var comment = {};
  comment.avatar = 'img/avatar-' + randomInteger(MIN_NUMBER_AVATAR, MAX_NUMBER_AVATAR) + '.svg';
  comment.message = createMessage();
  comment.name = NAMES[randomInteger(0, NAMES.length - 1)];
  return comment;
}

function createArrComments(count) {
  var comments = [];
  for (var i = 0; i < count; i++) {
    comments.push(createComment());
  }

  return comments;
}

var pictures = document.querySelector('.pictures');
var templatePicture = document.querySelector('#picture').content.querySelector('.picture');
var documentFragment = document.createDocumentFragment();

function fillPhotoTemplate(photoData) {
  var photo = templatePicture.cloneNode(true);
  photo.querySelector('.picture__img').src = photoData.url;
  photo.querySelector('.picture__likes').textContent = photoData.likes;
  photo.querySelector('.picture__comments').textContent = photoData.comments.length;

  return photo;
}
var photos = createArrPhotos(COUNT_PHOTOS);

function renderPhotos() {
  photos.forEach(function (photo) {
    documentFragment.append(fillPhotoTemplate(photo));
  });
  pictures.append(documentFragment);
}

renderPhotos();

function fillComment(data) {
  var comment = document.querySelector('.social__comment').cloneNode(true);
  var commentAvatar = comment.querySelector('.social__picture');
  var commentText = comment.querySelector('.social__text');
  commentAvatar.src = data.avatar;
  commentAvatar.alt = data.name;
  commentText.textContent = data.message;

  return comment;
}

var bigPicture = document.querySelector('.big-picture');
var bigPictureComments = document.querySelector('.social__comments');
var firstPhoto = photos[0];

bigPicture.querySelector('.big-picture__img img').src = firstPhoto.url;
bigPicture.querySelector('.likes-count').textContent = firstPhoto.likes;
bigPicture.querySelector('.comments-count').textContent = firstPhoto.comments.length;
bigPicture.querySelector('.social__caption').textContent = firstPhoto.description;

var documentFragmentComments = document.createDocumentFragment();

firstPhoto.comments.forEach(function (comment) {
  documentFragmentComments.append(fillComment(comment));
});

while (bigPictureComments.firstChild) {
  bigPictureComments.removeChild(bigPictureComments.firstChild);
}

bigPictureComments.append(documentFragmentComments);

// bigPicture.classList.remove('hidden');
// document.body.classList.add('modal-open');
bigPicture.querySelector('.social__comment-count').classList.add('hidden');
bigPicture.querySelector('.comments-loader').classList.add('hidden');


var imgUploadForm = document.querySelector('.img-upload__form');
var uploadFile = imgUploadForm.querySelector('#upload-file');
var imgUploadOverlay = imgUploadForm.querySelector('.img-upload__overlay');
var closeButtonUploadOverlay = imgUploadOverlay.querySelector('.img-upload__cancel');

uploadFile.addEventListener('change', function () {
  openImgUploadOverlay();
});

closeButtonUploadOverlay.addEventListener('click', function () {
  closeImgUploadOverlay();
});

function uploadOverlayEscPressHandler(evt) {
  if (evt.key === KEY_NAME_ESCAPE) {
    closeImgUploadOverlay();
  }
}

function closeImgUploadOverlay() {
  imgUploadOverlay.classList.add('hidden');
  document.body.classList.remove('modal-open');
  document.removeEventListener('keydown', uploadOverlayEscPressHandler);
  uploadFile.value = '';
}

function openImgUploadOverlay() {
  imgUploadOverlay.classList.remove('hidden');
  document.body.classList.add('modal-open');
  document.addEventListener('keydown', uploadOverlayEscPressHandler);
}

var imgUploadPreview = imgUploadOverlay.querySelector('.img-upload__preview img');
var increaseScaleButton = imgUploadOverlay.querySelector('.scale__control--bigger');
var decreaseScaleButton = imgUploadOverlay.querySelector('.scale__control--smaller');
var scaleValue = imgUploadOverlay.querySelector('.scale__control--value');

function changeValueScale(value) {
  scaleValue.value = value + '%';
  imgUploadPreview.style.transform = 'scale(' + value / 100 + ')';
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

var textHashtags = imgUploadOverlay.querySelector('.text__hashtags');
var textDescription = imgUploadOverlay.querySelector('.text__description');

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
    field.addEventListener('blur', textFieldBlurHandler);
  });

  function textFieldBlurHandler() {
    document.addEventListener('keydown', uploadOverlayEscPressHandler);
    field.removeEventListener('blur', textFieldBlurHandler);
  }
}

addHandlingTextField(textHashtags);
addHandlingTextField(textDescription);
