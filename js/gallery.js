'use strict';

(function () {
  var realPhotos;
  var picturesContainer = document.querySelector('.pictures');
  var templatePicture = document.querySelector('#picture').content.querySelector('.picture');
  var documentFragment = document.createDocumentFragment();

  window.backend.load(successHandler);

  function fillPhotoTemplate(data) {
    var photo = templatePicture.cloneNode(true);
    photo.querySelector('.picture__img').src = data.url;
    photo.querySelector('.picture__likes').textContent = data.likes;
    photo.querySelector('.picture__comments').textContent = data.comments.length;

    return photo;
  }

  function successHandler(data) {
    realPhotos = data;
    updatePhotos(data);
    window.filters.renderFilters(realPhotos);
  }

  function updatePhotos(photos) {
    Array.from(picturesContainer.children).forEach(function (picture) {
      if (picture.classList.contains('picture')) {
        picturesContainer.removeChild(picture);
      }
    });
    photos.forEach(function (photo) {
      documentFragment.append(fillPhotoTemplate(photo));
    });
    picturesContainer.append(documentFragment);
  }

  picturesContainer.addEventListener('click', function (evt) {
    determinePhoto(evt);
  });

  picturesContainer.addEventListener('keydown', function (evt) {
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
  window.filters.onRandomButtonFilter = window.debounce(function (photos) {
    updatePhotos(photos);
  });
  window.filters.onDefaultButtonFilter = window.debounce(function (photos) {
    updatePhotos(photos);
  });
  window.filters.onDiscussedButtonFilter = window.debounce(function (photos) {
    updatePhotos(photos);
  });

})();
