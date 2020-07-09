'use strict';

(function () {
  var realPhotos;
  var pictures = document.querySelector('.pictures');
  var templatePicture = document.querySelector('#picture').content.querySelector('.picture');
  var documentFragment = document.createDocumentFragment();

  function fillPhotoTemplate(data) {
    var photo = templatePicture.cloneNode(true);
    photo.querySelector('.picture__img').src = data.url;
    photo.querySelector('.picture__likes').textContent = data.likes;
    photo.querySelector('.picture__comments').textContent = data.comments.length;

    return photo;
  }

  function renderPhotos(photos) {
    realPhotos = photos;
    photos.forEach(function (photo) {
      documentFragment.append(fillPhotoTemplate(photo));
    });
    pictures.append(documentFragment);
  }
  window.backend.load(renderPhotos);

  pictures.addEventListener('click', function (evt) {
    determinePhoto(evt);
  });

  pictures.addEventListener('keydown', function (evt) {
    window.utils.isEnterEvent(evt, function () {
      determinePhoto(evt);
    });
  });

  function determinePhoto(evt) {
    var target = evt.target;
    if (target.classList.contains('picture')) {
      target = evt.target.firstElementChild;
    }
    if (target.classList.contains('picture__img')) {
      for (var i = 0; i < realPhotos.length; i++) {
        if (target.getAttribute('src') === realPhotos[i].url) {
          window.preview.showPreview(realPhotos[i]);
          break;
        }
      }
    }
  }
})();
