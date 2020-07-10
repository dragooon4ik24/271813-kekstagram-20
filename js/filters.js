'use strict';

window.filters = (function () {
  var filters = document.querySelector('.img-filters');
  var filterButtons = filters.querySelectorAll('.img-filters__button');
  var defaultFilterButton = filters.querySelector('#filter-default');
  var randomFilterButton = filters.querySelector('#filter-random');
  var discussedFilterButton = filters.querySelector('#filter-discussed');

  function renderFilters(photos, update) {
    filters.classList.remove('img-filters--inactive');

    defaultFilterButton.addEventListener('click', function () {
      makeButtonActive(defaultFilterButton);
      update(photos);
    });
    randomFilterButton.addEventListener('click', function () {
      makeButtonActive(randomFilterButton);
      update(photos.slice(0, 10));
    });
    discussedFilterButton.addEventListener('click', function () {
      makeButtonActive(discussedFilterButton);
      update(photos.slice(0, window.utils.getRandomNumber(5, 10)));
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
  return renderFilters;
})();
