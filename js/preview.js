'use strict';
window.preview = (function () {
  var bigPicture = document.querySelector('.big-picture');
  var bigPictureComments = bigPicture.querySelector('.social__comments');
  var closeButtonBigPicture = bigPicture.querySelector('.big-picture__cancel');

  function showBigPicture(photo) {
    bigPicture.querySelector('.big-picture__img img').src = photo.url;
    bigPicture.querySelector('.likes-count').textContent = photo.likes;
    bigPicture.querySelector('.comments-count').textContent = photo.comments.length;
    bigPicture.querySelector('.social__caption').textContent = photo.description;

    var documentFragmentComments = document.createDocumentFragment();

    photo.comments.forEach(function (comment) {
      documentFragmentComments.append(fillComment(comment));
    });
    while (bigPictureComments.firstChild) {
      bigPictureComments.removeChild(bigPictureComments.firstChild);
    }
    bigPictureComments.append(documentFragmentComments);
    bigPicture.querySelector('.social__comment-count').classList.add('hidden');
    bigPicture.querySelector('.comments-loader').classList.add('hidden');
    bigPicture.classList.remove('hidden');
    document.body.classList.add('modal-open');
    document.addEventListener('keydown', bigPictureEscPressHandler);
  }

  function fillComment(data) {
    var comment = document.querySelector('.social__comment').cloneNode(true);
    var commentAvatar = comment.querySelector('.social__picture');
    var commentText = comment.querySelector('.social__text');
    commentAvatar.src = data.avatar;
    commentAvatar.alt = data.name;
    commentText.textContent = data.message;

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
  return {
    showPreview: showBigPicture
  };
})();
