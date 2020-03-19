'use strict';

(function () {
  var KEYCODE_SPACE = 32;
  var KEYCODE_ENTER = 13;

  var login = document.querySelector('.login');
  var loginForm = login.querySelector('.login__form');
  var loginUsername = loginForm.querySelector('#login-username');
  var loginPassword = loginForm.querySelector('#login-password');
  var loginPasswordToggle = loginForm.querySelector('#login-password-toggle');
  var loginOpenButton = document.querySelector('.page-header__user-link_login');
  var loginModal = new window.Modal(login, loginOpenButton);

  var isStorageSupport = true;
  var dataStorage = {};

  loginModal.open = function () {
    activateLogin();
    window.Modal.prototype.open.call(this);
  };

  loginModal.close = function () {
    deactivateLogin();
    window.Modal.prototype.close.call(this);
  };

  var activateLogin = function () {
    loginForm.addEventListener('submit', onLoginFormSubmit);
    loginPasswordToggle.addEventListener('mousedown', onLoginPasswordToggleMouseDown);
    loginPasswordToggle.addEventListener('keydown', onLoginPasswordToggleKeyDown);
    loginPasswordToggle.addEventListener('touchstart', onLoginPasswordToggleTouchStart);
  };

  var deactivateLogin = function () {
    loginForm.removeEventListener('submit', onLoginFormSubmit);
    loginPasswordToggle.removeEventListener('mousedown', onLoginPasswordToggleMouseDown);
    loginPasswordToggle.removeEventListener('keydown', onLoginPasswordToggleKeyDown);
    loginPasswordToggle.removeEventListener('touchstart', onLoginPasswordToggleTouchStart);
    document.removeEventListener('mouseup', onLoginPasswordToggleMouseUp);
    document.removeEventListener('keyup', onLoginPasswordToggleKeyUp);
    document.removeEventListener('touchend', onLoginPasswordToggleTouchEnd);
  };

  var onLoginFormSubmit = function () {
    if (isStorageSupport) {
      localStorage.setItem('username', loginUsername.value);
      localStorage.setItem('password', loginPassword.value);
    }
  };

  try {
    dataStorage.username = localStorage.getItem('username');
    dataStorage.password = localStorage.getItem('password');
  } catch (err) {
    isStorageSupport = false;
  }

  loginOpenButton.addEventListener('click', function (evt) {
    evt.preventDefault();

    if (dataStorage.username) {
      loginUsername.value = dataStorage.username;
      loginPassword.value = dataStorage.password;
      loginPassword.focus();
    } else {
      loginUsername.focus();
    }
  });

  var showPassword = function () {
    loginPassword.type = 'text';
    loginPasswordToggle.classList.remove('login__password-toggle_closed');

    document.addEventListener('mouseup', onLoginPasswordToggleMouseUp);
    document.addEventListener('keyup', onLoginPasswordToggleKeyUp);
    document.addEventListener('touchend', onLoginPasswordToggleTouchEnd);
  };

  var hidePassword = function () {
    loginPassword.type = 'password';
    loginPasswordToggle.classList.add('login__password-toggle_closed');
  };

  var onLoginPasswordToggleMouseUp = function () {
    hidePassword();
  };

  var onLoginPasswordToggleMouseDown = function () {
    showPassword();
  };

  var onLoginPasswordToggleTouchEnd = function () {
    hidePassword();
  };

  var onLoginPasswordToggleTouchStart = function () {
    showPassword();
  };

  var onLoginPasswordToggleKeyUp = function (evt) {
    if (evt.keyCode === KEYCODE_SPACE || evt.keyCode === KEYCODE_ENTER) {
      hidePassword();
    }
  };

  var onLoginPasswordToggleKeyDown = function (evt) {
    if (evt.keyCode === KEYCODE_SPACE || evt.keyCode === KEYCODE_ENTER) {
      showPassword();
    }
  };
})();
