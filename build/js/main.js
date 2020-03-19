'use strict';

var sliderBanner = new Swiper('.banner__slider', {
  slidesPerView: 'auto',
  centeredSlides: true,

  autoplay: {
    delay: 4000,
    disableOnInteraction: false,
  },

  pagination: {
    el: '.swiper-pagination',
    clickable: false,
  },

  breakpoints: {
    1024: {
      noSwiping: true,
      noSwipingClass: 'swiper-no-desktop-swiping',
      pagination: {
        clickable: true
      }
    }
  }
});

'use strict';

var Tabs = function () {
  this.tabsElements = document.querySelectorAll('.services__tabs-item');
  this.init('.services__slider');
};

Tabs.prototype.init = function (selectorSlider) {
  var slider = this;

  slider.swiper = new Swiper(selectorSlider, {
    slidesPerView: 'auto',
    centeredSlides: true,
    speed: 300,
    pagination: {
      el: '.swiper-pagination',
    },

    on: {
      slideChange: function () {
        slider.tabsElements.forEach(function (el) {
          el.classList.remove('services__tabs-item_active');
        });
        slider.tabsElements[slider.swiper.activeIndex].classList.add('services__tabs-item_active');
      }
    },

    breakpoints: {
      1024: {
        speed: 0,
        noSwiping: true,
        noSwipingClass: 'swiper-no-desktop-swiping',
      }
    }
  });

  slider.addListener();
};

Tabs.prototype.addListener = function () {
  var slider = this;

  this.tabsElements.forEach(function (el, index) {
    el.addEventListener('click', function () {
      slider.updateSlide(index);
    });
  });
};

Tabs.prototype.updateSlide = function (index) {
  this.swiper.slideTo(index);
  this.updateControls(index);
};

Tabs.prototype.updateControls = function (index) {
  if (this.tabsElements[index]) {
    this.tabsElements.forEach(function (el) {
      el.classList.remove('services__tabs-item_active');
    });
    this.tabsElements[index].classList.add('services__tabs-item_active');
  }
};

var sliderServices = new Tabs();

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

/*eslint-disable*/

'use strict';

(function () {
  var maskedInputs = document.querySelectorAll('input[data-unit]');

  var setMask = function () {
    maskedInputs.forEach(function (input) {
      var maskUnit = input.getAttribute('data-unit');
      var maskOption;

      switch (maskUnit) {
        case "currency":
          maskOption = {
            mask: 'num рублей',
            lazy: false,

            blocks: {
              num: {
                mask: Number,
                thousandsSeparator: ' ',
              }
            }
          }
          break;
        case "period":
          maskOption = {
            mask: 'num лет',
            lazy: false,

            blocks: {
              num: {
                mask: Number,
                thousandsSeparator: ' ',
              }
            }
          }
          break;
        case "numero-symbol":
          maskOption = {
            mask: '№ num',
            lazy: false,

            blocks: {
              num: {
                mask: Number,
                commit: function (value, masked) {
                  masked._value = value.padStart(4, '0');
                }
              }
            }
          }
      };
      var mask = IMask(input, maskOption);
    });
  };

  setMask();
})();

'use strict';

var colorSelect = new CustomSelect({
  elem: 'credit-purpose'
});
