'use strict';

(function () {
  var COUNT_PHOTOS = 25;
  var photos = window.data(COUNT_PHOTOS);
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

  function renderPhotos() {
    photos.forEach(function (photo) {
      documentFragment.append(fillPhotoTemplate(photo));
    });
    pictures.append(documentFragment);
  }

  renderPhotos();

  pictures.addEventListener('click', function (evt) {
    var target = evt.target;
    determinePhoto(target);
  });

  pictures.addEventListener('keydown', function (evt) {
    if (evt.key === window.constants.KEY_NAME_ENTER) {
      var target = evt.target.firstElementChild;
      determinePhoto(target);
    }
  });

  function determinePhoto(target) {
    if (target.classList.contains('picture__img')) {
      for (var i = 0; i < photos.length; i++) {
        if (target.getAttribute('src') === photos[i].url) {
          showBigPicture(photos[i]);
          break;
        }
      }
    }
  }
})();
