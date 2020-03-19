'use strict';

(function () {
  var KEYCODE_ESC = 27;

  var Modal = function (rootElement, openButtonElement) {
    this.root = rootElement;
    this.openButton = openButtonElement;
    this.closeButton = this.root.querySelector('.modal__close');
    this.activateOpenButton();
  };

  Modal.prototype.open = function () {
    document.body.classList.toggle('no-scroll');
    document.addEventListener('keydown', this);
    this.root.classList.toggle('modal_hidden');
    this.closeButton.addEventListener('click', this);
  };

  Modal.prototype.close = function () {
    document.body.classList.toggle('no-scroll');
    document.removeEventListener('keydown', this);
    this.root.classList.toggle('modal_hidden');
    this.closeButton.removeEventListener('click', this);
  };

  Modal.prototype.handleEvent = function (evt) {
    switch (evt.type) {
      case 'click':
        this.onCloseButtonClick(evt);
        break;
      case 'keydown': {
        this.onModalEscPress(evt);
      }
    }
  };

  Modal.prototype.activateOpenButton = function () {
    var modal = this;

    modal.openButton.addEventListener('click', function (evt) {
      evt.preventDefault();
      modal.open();
    });
  };

  Modal.prototype.onCloseButtonClick = function (evt) {
    evt.preventDefault();
    this.close();
  };

  Modal.prototype.onModalEscPress = function (evt) {
    if (evt.keyCode === KEYCODE_ESC) {
      evt.preventDefault();
      this.close();
    }
  };

  window.Modal = Modal;
})();
