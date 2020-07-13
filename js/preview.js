'use strict';
window.preview = (function () {
  var MIN_COUNT_SHOWN_COMMENTS = 5;

  var bigPicture = document.querySelector('.big-picture');
  var bigPictureComments = bigPicture.querySelector('.social__comments');
  var closeButtonBigPicture = bigPicture.querySelector('.big-picture__cancel');
  var shownComments = bigPicture.querySelector('.social__comment-count');
  var loadComments = bigPicture.querySelector('.comments-loader');
  var templateComment = getTemplateComment();
  var countShownComments = MIN_COUNT_SHOWN_COMMENTS;
  var fullCountComments;
  var shownPhoto;

  function showBigPicture(photo) {
    shownPhoto = photo;
    fullCountComments = shownPhoto.comments.length;
    bigPicture.querySelector('.big-picture__img img').src = photo.url;
    bigPicture.querySelector('.likes-count').textContent = photo.likes;
    bigPicture.querySelector('.comments-count').textContent = photo.comments.length;
    bigPicture.querySelector('.social__caption').textContent = photo.description;

    bigPicture.classList.remove('hidden');
    document.body.classList.add('modal-open');
    document.addEventListener('keydown', bigPictureEscPressHandler);

    while (bigPictureComments.firstChild) {
      bigPictureComments.removeChild(bigPictureComments.firstChild);
    }
    if (fullCountComments < MIN_COUNT_SHOWN_COMMENTS) {
      shownComments.firstChild.textContent = fullCountComments + ' из ';
      if (!loadComments.classList.contains('hidden')) {
        loadComments.classList.add('hidden');
      }
      loadComments.classList.add('hidden');
      countShownComments = fullCountComments;
    } else {
      shownComments.firstChild.textContent = '5 из ';
      countShownComments = MIN_COUNT_SHOWN_COMMENTS;
      if (loadComments.classList.contains('hidden')) {
        loadComments.classList.remove('hidden');
      }
    }
    renderComments(photo.comments.slice(0, countShownComments));
  }

  function renderComments(comments) {
    var documentFragmentComments = document.createDocumentFragment();

    comments.forEach(function (comment) {
      documentFragmentComments.append(fillComment(comment));
      bigPictureComments.append(documentFragmentComments);
    });
  }

  function fillComment(data) {
    var comment = templateComment.cloneNode(true);
    var avatar = comment.querySelector('.social__picture');
    avatar.setAttribute('src', data.avatar);
    avatar.setAttribute('alt', data.name);
    comment.querySelector('.social__text').textContent = data.message;

    return comment;
  }

  function getTemplateComment() {
    var comment = document.createElement('li');
    comment.classList.add('social__comment');

    var commentAvatar = document.createElement('img');
    commentAvatar.classList.add('social__picture');
    commentAvatar.setAttribute('width', '35');
    commentAvatar.setAttribute('height', '35');

    var commentText = document.createElement('p');
    commentText.classList.add('social__text');

    comment.append(commentAvatar);
    comment.append(commentText);

    return comment;
  }

  closeButtonBigPicture.addEventListener('click', function () {
    closeBigPicture();
  });

  function bigPictureEscPressHandler(evt) {
    window.utils.isEscEvent(evt, closeBigPicture);
  }

  function closeBigPicture() {
    bigPicture.classList.add('hidden');
    document.body.classList.remove('modal-open');
    document.removeEventListener('keydown', bigPictureEscPressHandler);
  }

  loadComments.addEventListener('click', function () {
    var countRemainingPhotos = fullCountComments - countShownComments;
    if (countRemainingPhotos <= MIN_COUNT_SHOWN_COMMENTS) {
      renderComments(shownPhoto.comments.slice(countShownComments, countShownComments += countRemainingPhotos));
      loadComments.classList.add('hidden');
    } else {
      renderComments(shownPhoto.comments.slice(countShownComments, countShownComments += MIN_COUNT_SHOWN_COMMENTS));
    }
    shownComments.firstChild.textContent = countShownComments + ' из ';
  });

  return {
    showPreview: showBigPicture
  };
})();
