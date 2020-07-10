'use strict';

window.data = (function () {
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

  function createArrPhotos(count) {
    var photos = [];
    var arrIndexPhotos = [];
    for (var i = 0; i < count; i++) {
      arrIndexPhotos[i] = i + 1;
    }
    var shuffledArrIndexPhotos = window.utils.shuffleArray(arrIndexPhotos);
    photos = shuffledArrIndexPhotos.map(function (el) {
      return createDataPhoto(el);
    });

    return photos;
  }

  function createDataPhoto(number) {
    var data = {};
    data.url = 'photos/' + number + '.jpg';
    data.description = '';
    data.likes = window.utils.getRandomNumber(MIN_COUNT_LIKES, MAX_COUNT_LIKES);
    data.comments = createArrComments(window.utils.getRandomNumber(MIN_COUNT_COMMENTS, MAX_COUNT_COMMENTS));
    return data;
  }

  function createMessage() {
    var shuffledMessages = window.utils.shuffleArray(COMMENTS);
    var countSentences = window.utils.getRandomNumber(MIN_COUNT_SENTENCES, MAX_COUNT_SENTENCES);
    var arrMessage = shuffledMessages.slice(0, countSentences);
    var message = arrMessage.length === 1 ? arrMessage[0] : arrMessage[0] + ' ' + arrMessage[1];
    return message;
  }

  function createComment() {
    var comment = {};
    comment.avatar = 'img/avatar-' + window.utils.getRandomNumber(MIN_NUMBER_AVATAR, MAX_NUMBER_AVATAR) + '.svg';
    comment.message = createMessage();
    comment.name = NAMES[window.utils.getRandomNumber(0, NAMES.length - 1)];
    return comment;
  }

  function createArrComments(length) {
    var comments = [];
    for (var i = 0; i < length; i++) {
      comments.push(createComment());
    }

    return comments;
  }

  return {
    generatePhotos: createArrPhotos
  };
})();
