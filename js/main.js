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
var COMMENTS = [
  'Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
];
var NAMES = ['Ваня', 'Антонина', 'Серега', 'Иннокентий', 'Вера', 'Надежда', 'Любовь'];

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
bigPicture.classList.remove('hidden');

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

bigPicture.querySelector('.social__comment-count').classList.add('hidden');
bigPicture.querySelector('.comments-loader').classList.add('hidden');
document.body.classList.add('modal-open');
