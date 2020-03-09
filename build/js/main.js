'use strict';

(function () {
  var KEYCODE_ESC = 27;
  var KEYCODE_SPACE = 32;
  var KEYCODE_ENTER = 13;

  var modal = document.querySelector('.modal');
  var modalForm = modal.querySelector('.modal__form');
  var modalLogin = modal.querySelector('#modal-login');
  var modalPassword = modal.querySelector('#modal-password');
  var modalPasswordToggle = modal.querySelector('#modal-password-toggle');
  var modalOpenButton = document.querySelector('.page-header__user-link_login');
  var modalCloseButton = modal.querySelector('.modal__close');

  var isStorageSupport = true;
  var dataStorage = {};

  var openModal = function () {
    document.body.classList.toggle('no-scroll');
    modal.classList.toggle('modal_show');
    modalCloseButton.addEventListener('click', onModalCloseButtonClick);
    modalForm.addEventListener('submit', onModalFormSubmit);
    modalPasswordToggle.addEventListener('mousedown', onModalPasswordToggleMouseDown);
    modalPasswordToggle.addEventListener('keydown', onModalPasswordToggleKeyDown);
    document.addEventListener('keydown', onModalEscPress);
  };

  var closeModal = function () {
    document.body.classList.toggle('no-scroll');
    modal.classList.toggle('modal_show');
    modalCloseButton.removeEventListener('click', onModalCloseButtonClick);
    modalForm.removeEventListener('submit', onModalFormSubmit);
    modalPasswordToggle.removeEventListener('mousedown', onModalPasswordToggleMouseDown);
    modalPasswordToggle.removeEventListener('keydown', onModalPasswordToggleKeyDown);
    document.removeEventListener('keydown', onModalEscPress);
    document.removeEventListener('mouseup', onModalPasswordToggleMouseUp);
    document.removeEventListener('keyup', onModalPasswordToggleKeyUp);
  };

  var onModalCloseButtonClick = function (evt) {
    evt.preventDefault();
    closeModal();
  };

  var onModalEscPress = function (evt) {
    if (evt.keyCode === KEYCODE_ESC) {
      evt.preventDefault();
      closeModal();
    }
  };

  var onModalFormSubmit = function () {
    if (isStorageSupport) {
      localStorage.setItem('login', modalLogin.value);
      localStorage.setItem('password', modalPassword.value);
    }
  };

  try {
    dataStorage.login = localStorage.getItem('login');
    dataStorage.password = localStorage.getItem('password');
  } catch (err) {
    isStorageSupport = false;
  }

  modalOpenButton.addEventListener('click', function (evt) {
    evt.preventDefault();
    openModal();

    if (dataStorage.login) {
      modalLogin.value = dataStorage.login;
      modalPassword.value = dataStorage.password;
      modalPassword.focus();
    } else {
      modalLogin.focus();
    }
  });

  var showPassword = function () {
    modalPassword.type = 'text';
    modalPasswordToggle.classList.remove('form__password-toggle_closed');

    document.addEventListener('mouseup', onModalPasswordToggleMouseUp);
    document.addEventListener('keyup', onModalPasswordToggleKeyUp);
  };

  var hidePassword = function () {
    modalPassword.type = 'password';
    modalPasswordToggle.classList.add('form__password-toggle_closed');
  };

  var onModalPasswordToggleMouseDown = function () {
    showPassword();
  };

  var onModalPasswordToggleMouseUp = function () {
    hidePassword();
  };

  var onModalPasswordToggleKeyDown = function (evt) {
    if (evt.keyCode === KEYCODE_SPACE || evt.keyCode === KEYCODE_ENTER) {
      showPassword();
    }
  };

  var onModalPasswordToggleKeyUp = function (evt) {
    if (evt.keyCode === KEYCODE_SPACE || evt.keyCode === KEYCODE_ENTER) {
      hidePassword();
    }
  };
})();

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
    clickable: true,
  },

  breakpoints: {
    1024: {
      noSwiping: true,
      noSwipingClass: 'swiper-no-desktop-swiping',
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
