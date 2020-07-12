'use strict';

window.filters = (function () {
  var COUNT_RANDOM_PHOTO = 10;

  var filtersBlock = document.querySelector('.img-filters');
  var filterButtons = filtersBlock.querySelectorAll('.img-filters__button');
  var defaultFilterButton = filtersBlock.querySelector('#filter-default');
  var randomFilterButton = filtersBlock.querySelector('#filter-random');
  var discussedFilterButton = filtersBlock.querySelector('#filter-discussed');

  var filters = {
    renderFilters: renderFilters,
    onDefaultButtonFilter: function () {},
    onRandomButtonFilter: function () {},
    onDiscussedButtonFilter: function () {}
  };

  function renderFilters(photos) {
    filtersBlock.classList.remove('img-filters--inactive');

    defaultFilterButton.addEventListener('click', function () {
      makeButtonActive(defaultFilterButton);
      filters.onDefaultButtonFilter(photos);
    });
    randomFilterButton.addEventListener('click', function () {
      makeButtonActive(randomFilterButton);
      var randomPhoto = window.utils.getShuffledArray(photos).slice(0, COUNT_RANDOM_PHOTO);
      filters.onRandomButtonFilter(randomPhoto);
    });
    discussedFilterButton.addEventListener('click', function () {
      makeButtonActive(discussedFilterButton);
      var sortedPhoto = photos.slice(0, photos.length).sort(function (photo, nextPhoto) {
        return nextPhoto.comments.length - photo.comments.length;
      });
      filters.onDiscussedButtonFilter(sortedPhoto);
    });
  }

  function makeButtonActive(button) {
    Array.from(filterButtons).forEach(function (el) {
      if (el.classList.contains('img-filters__button--active')) {
        el.classList.remove('img-filters__button--active');
      }
    });
    button.classList.add('img-filters__button--active');
  }

  return filters;
})();
