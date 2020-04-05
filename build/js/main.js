'use strict';

(function () {
  var DOWNLOAD_URL = 'https://echo.htmlacademy.ru';
  var UPLOAD_URL = 'https://echo.htmlacademy.ru';
  var XHR_TIMEOUT = 10000;
  var HTTP_STATUS_OK = 200;

  var load = function (onSuccess, onError, url, data) {
    var httpMethod = data
      ? 'POST'
      : 'GET';
    var xhr = new XMLHttpRequest();

    xhr.responseType = 'json';
    xhr.addEventListener('load', function () {
      if (xhr.status === HTTP_STATUS_OK) {
        onSuccess(xhr.response);
      } else {
        onError('Статус ответа: ' + xhr.status + ' ' + xhr.statusText);
      }
    });
    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });
    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });

    xhr.timeout = XHR_TIMEOUT;

    xhr.open(httpMethod, url);
    xhr.send(data);
  };

  window.server = {
    load: load,
    DOWNLOAD_URL: DOWNLOAD_URL,
    UPLOAD_URL: UPLOAD_URL
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
    if (this.openButton) {
      this.activateOpenButton();
    }
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

    modal.openButton.addEventListener('click', function () {
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

'use strict';

(function () {

  var applicationCount = 1;

  var formatNumber = function (num) {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 ');
  };

  var getIntValue = function (string) {
    if (typeof string === 'string') {
      return parseInt(string.split(' ').join(''), 10);
    }
    return string;
  };

  var getInitialString = function (ratio, amount) {
    var initialRatio = getIntValue(ratio);
    var amountValue = getIntValue(amount);

    return String((initialRatio / 100) * amountValue);
  };

  var getParameters = function (purpose) {
    var parameters = {};

    switch (purpose) {
      case 'none':
        parameters = {
          'isActive': false
        };
        break;

      case 'car':
        parameters = {
          'isActive': true,
          'calculator-type': 'car',
          'calculator-purpose': 'Автокредит',
          'calculator-amount-label': 'Стоимость автомобиля',
          'calculator-amount-max': 5000000,
          'calculator-amount-min': 500000,
          'calculator-amount-step': 50000,
          'calculator-initial-step': 5,
          'calculator-initial-ratio': 20,
          'calculator-term-min': 1,
          'calculator-term-max': 5,
          'calculator-term-step': 1,
          'calculator-checkboxes': [
            {
              id: 'car-insurance',
              text: 'Оформить КАСКО в нашем банке'
            },
            {
              id: 'life-insurance',
              text: 'Оформить Страхование жизни в нашем банке'
            }
          ],
          'offer-amount-min': 200000,
          'offer-amount-label': 'Сумма автокредита',
          'offer-car-price-breakpoint': 2000000,
          'offer-interest-default': 16,
          'offer-interest-max': 15,
          'offer-interest-mid': 8.5,
          'offer-interest-min': 3.5,
          'offer-income-annuity-ratio': 0.45,
          'offer-message-credit-name': 'автокредиты',
        };
        break;

      case 'mortgage':
        parameters = {
          'isActive': true,
          'calculator-type': 'mortgage',
          'calculator-purpose': 'Ипотека',
          'calculator-amount-label': 'Стоимость недвижимости',
          'calculator-amount-max': 25000000,
          'calculator-amount-min': 1200000,
          'calculator-amount-step': 100000,
          'calculator-initial-step': 5,
          'calculator-initial-ratio': 10,
          'calculator-term-min': 5,
          'calculator-term-max': 30,
          'calculator-term-step': 1,
          'calculator-checkboxes': [
            {
              id: 'maternal-capital',
              text: 'Использовать материнский капитал'
            }
          ],
          'offer-amount-min': 500000,
          'offer-amount-label': 'Сумма ипотеки',
          'offer-maternal-capital': 470000,
          'offer-initial-ratio-breakpoint': 15,
          'offer-interest-default': 9.4,
          'offer-interest-min': 8.5,
          'offer-income-annuity-ratio': 0.45,
          'offer-message-credit-name': 'ипотечные кредиты',
        };
        break;

      case 'consumer':
        parameters = {
          'isActive': true,
          'calculator-type': 'consumer',
          'calculator-purpose': 'Потребительский кредит',
          'calculator-amount-label': 'Сумма кредита',
          'calculator-amount-max': 3000000,
          'calculator-amount-min': 50000,
          'calculator-amount-step': 50000,
          'calculator-term-min': 5,
          'calculator-term-max': 7,
          'calculator-term-step': 1,
          'calculator-checkboxes': [
            {
              id: 'salary-project',
              text: 'Участник зарплатного проекта нашего банка'
            }
          ],
          'offer-amount-min': 50000,
          'offer-amount-label': 'Сумма кредита',
          'offer-amount-breakpoint-min': 750000,
          'offer-amount-breakpoint-max': 2000000,
          'offer-interest-default': 15,
          'offer-interest-max': 12.5,
          'offer-interest-min': 9.5,
          'offer-interest-bonus': 0.5,
          'offer-income-annuity-ratio': 0.45,
          'offer-message-credit-name': 'потребительские кредиты',
        };
        break;
    }

    return parameters;
  };

  var getMaskOptions = function (input) {
    var maskUnit = input.getAttribute('data-unit');
    var maskOptions = {};

    switch (maskUnit) {
      case 'currency':
        maskOptions = {
          mask: 'num рублей',
          lazy: false,

          blocks: {
            num: {
              mask: Number,
              scale: 0,
              thousandsSeparator: ' ',
            }
          }
        };
        break;
      case 'period':
        maskOptions = {
          mask: 'num лет',
          lazy: false,

          blocks: {
            num: {
              mask: Number,
              sclae: 0,
              thousandsSeparator: ' ',
            }
          }
        };
        break;
      case 'numero-symbol':
        maskOptions = {
          mask: '№ num',
          lazy: false,

          blocks: {
            num: {
              mask: Number,
              scale: 0,
              commit: function (value, masked) {
                masked._value = value.padStart(4, '0');
              }
            }
          }
        };
        break;
      case 'phone':
        maskOptions = {
          mask: '+{7} (000) 000-00-00'
        };
        break;
    }
    return maskOptions;
  };

  var CalculatorItem = function (rootSelector) {
    this.isValid = true;
    this.root = document.querySelector(rootSelector);
    this.label = this.root.querySelector('label');
    this.inputNumber = this.root.querySelector('.input-number');
    this.inputRange = this.root.querySelector('.input-range');
    if (this.inputNumber) {
      this.inputNumberField = this.inputNumber.querySelector('input');
      this.inputNumberFieldId = this.inputNumberField.id;
      this.inputNumberMask = IMask(this.inputNumberField, getMaskOptions(this.inputNumberField));
      this.inputNumberButtonUp = this.inputNumber.querySelector('.input-number__button_up');
      this.inputNumberButtonDown = this.inputNumber.querySelector('.input-number__button_down');
      this.inputNumberCaption = this.inputNumber.querySelector('.input-number__caption');
      this.inputNumberCaptionMin = this.inputNumber.querySelector('output[name="calculator-amount-min"]');
      this.inputNumberCaptionMax = this.inputNumber.querySelector('output[name="calculator-amount-max"]');
    }
    if (this.inputRange) {
      this.inputRangeField = this.inputRange.querySelector('input[type="range"]');
      this.inputRangeValue = this.inputRange.querySelector('.input-range__value output');
      this.inputRangeMin = this.inputRange.querySelector('.input-range__min output');
      this.inputRangeMax = this.inputRange.querySelector('.input-range__max output');
    }
  };

  CalculatorItem.prototype.setParameters = function (parameters) {
    if (this.root.id === 'calculator-amount') {
      this.label.textContent = parameters['calculator-amount-label'];
      this.inputNumberMask.updateOptions(getMaskOptions(this.inputNumberField));
      this.inputNumberMask.value = String(parameters['calculator-amount-min']);
      this.inputNumberCaptionMin.value = formatNumber(parameters['calculator-amount-min']);
      this.inputNumberCaptionMax.value = formatNumber(parameters['calculator-amount-max']);
    }

    if (this.root.id === 'calculator-initial') {
      this.inputNumberMask.value = String(parameters['calculator-amount-min'] * parameters['calculator-initial-ratio'] / 100);
      this.inputRangeValue.value = parameters['calculator-initial-ratio'];
      this.inputRangeField.min = parameters['calculator-initial-ratio'];
      this.inputRangeField.step = parameters['calculator-initial-step'];
      this.inputRangeField.value = parameters['calculator-initial-ratio'];
    }

    if (this.root.id === 'calculator-term') {
      this.inputNumberMask.value = String(parameters['calculator-term-min']);
      this.inputRangeField.min = parameters['calculator-term-min'];
      this.inputRangeField.max = parameters['calculator-term-max'];
      this.inputRangeField.step = parameters['calculator-term-step'];
      this.inputRangeField.value = parameters['calculator-term-min'];
      this.inputRangeMin.value = parameters['calculator-term-min'];
      this.inputRangeMax.value = parameters['calculator-term-max'];
    }
  };

  CalculatorItem.prototype.addHandlers = function (parameters) {
    var item = this;

    this.onInputNumberChange = function () {
      item.checkValidity(parameters['calculator-amount-min'], parameters['calculator-amount-max']);
    };

    this.onInputNumberFocus = function () {
      if (!item.isValid) {
        item.isValid = true;
        item.inputNumber.classList.remove('input-number_invalid');
        item.inputNumberMask.updateOptions(getMaskOptions(item.inputNumberField));
        item.inputNumberMask.value = String(parameters['calculator-amount-min']);
      }
    };

    this.onInputNumberBlur = function () {
      if (!item.isValid) {
        item.inputNumber.classList.add('input-number_invalid');
        item.inputNumberMask.updateOptions({
          mask: 'VALUE',
          blocks: {
            VALUE: {
              mask: String
            }
          }
        });
        item.inputNumberMask.value = 'Некорректное значение';
      }
    };

    this.onInputRangeInput = function (evt) {
      item.inputNumberMask.value = String(evt.target.value);
    };

    this.onTermInputNumberChange = function () {
      var termValue = getIntValue(item.inputNumberField.value);

      if (termValue < parameters['calculator-term-min'] || !termValue) {
        item.inputNumberMask.value = String(parameters['calculator-term-min']);
      }

      if (termValue > parameters['calculator-term-max']) {
        item.inputNumberMask.value = String(parameters['calculator-term-max']);
      }

      item.inputRangeField.value = getIntValue(item.inputNumberField.value);
    };
  };

  CalculatorItem.prototype.update = function (parameters) {
    this.removeListeners();
    this.setParameters(parameters);
    this.addHandlers(parameters);
    this.addListeners();
  };

  CalculatorItem.prototype.addListeners = function () {
    if (this.root.id === 'calculator-amount') {
      this.inputNumberField.addEventListener('change', this.onInputNumberChange);
      this.inputNumberField.addEventListener('focus', this.onInputNumberFocus);
      this.inputNumberField.addEventListener('blur', this.onInputNumberBlur);
    }

    if (this.root.id === 'calculator-term') {
      this.inputRangeField.addEventListener('input', this.onInputRangeInput);
      this.inputNumberField.addEventListener('change', this.onTermInputNumberChange);
    }
  };

  CalculatorItem.prototype.removeListeners = function () {
    if (this.root.id === 'calculator-amount') {
      this.inputNumberField.removeEventListener('change', this.onInputNumberChange);
      this.inputNumberField.removeEventListener('focus', this.onInputNumberFocus);
      this.inputNumberField.removeEventListener('blur', this.onInputNumberBlur);
    }

    if (this.root.id === 'calculator-term') {
      this.inputRangeField.removeEventListener('input', this.onInputRangeInput);
      this.inputNumberField.removeEventListener('change', this.onTermInputNumberChange);
    }
  };

  CalculatorItem.prototype.checkValidity = function (min, max) {
    var itemValue = getIntValue(this.inputNumberField.value);

    if (!itemValue || itemValue < min || itemValue > max) {
      this.isValid = false;
    } else {
      this.isValid = true;
    }
  };

  var Calculator = function (rootSelector) {
    var calculator = this;

    this.root = document.querySelector(rootSelector);
    this.form = this.root.querySelector('form');
    this.purpose = this.root.querySelector('#calculator-purpose');
    this.term = new CalculatorItem('#calculator-term');
    this.amount = new CalculatorItem('#calculator-amount');
    this.initial = new CalculatorItem('#calculator-initial');
    this.stepTwo = this.root.querySelector('.calculator__step_two');
    this.offer = this.root.querySelector('.calculator__offer');
    this.offerButton = this.offer.querySelector('.calculator__offer-button');
    this.message = this.root.querySelector('.calculator__invalid-message');
    this.messageCreditName = this.message.querySelector('.message__credit-name');
    this.messageCreditAmount = this.message.querySelector('.message__credit-amount-min');
    this.application = this.root.querySelector('.calculator__application');
    this.dataStorage = {};
    this.modal = this.root.querySelector('.calculator__modal');
    this.submitButton = this.root.querySelector('.calculator__submit');
    this.submitModal = new window.Modal(this.modal);
    this.isStorageSupport = true;

    this.form.addEventListener('change', function () {
      calculator.calculateOffer();
    });

    this.purpose.addEventListener('change', function (evt) {
      var purposeValue = evt.target.value;

      calculator.parameters = getParameters(purposeValue);

      if (purposeValue !== 'none') {
        calculator.activate();
      } else {
        calculator.stepTwo.classList.add('calculator__step_hidden');
      }

      if (purposeValue === 'consumer') {
        calculator.initial.root.classList.add('form__item_hidden');
      } else {
        calculator.initial.root.classList.remove('form__item_hidden');
      }
    });
  };

  Calculator.prototype.activate = function () {
    this.stepTwo.classList.remove('calculator__step_hidden');
    this.offer.classList.remove('calculator__offer_hidden');
    this.amount.update(this.parameters);
    if (this.initial) {
      this.initial.update(this.parameters);
    }
    this.term.update(this.parameters);
    this.addCheckboxes();
    this.removeListeners();
    this.addListeners();
    this.calculateOffer();
  };

  Calculator.prototype.deactivate = function () {
    this.removeListeners();
    this.stepTwo.classList.add('calculator__step_hidden');
    this.offer.classList.add('calculator__offer_hidden');
    this.message.classList.add('message_hidden');
    this.application.classList.add('calculator__application_hidden');
  };

  Calculator.prototype.addCheckboxes = function () {
    var calculatorCheckboxes = this.stepTwo.querySelector('.calculator__form-checkboxes');
    var checkboxElements = calculatorCheckboxes.querySelectorAll('.input-check');
    checkboxElements.forEach(function (el) {
      el.remove();
    });

    var checkboxTemplate = document.querySelector('#checkbox').content.querySelector('.input-check');

    this.parameters['calculator-checkboxes'].forEach(function (checkboxData) {
      var checkbox = checkboxTemplate.cloneNode(true);
      var checkboxInput = checkbox.querySelector('input[type="checkbox"]');
      var checkboxLabel = checkbox.querySelector('.input-check__label');
      checkboxInput.id = checkboxData.id;
      checkboxInput.name = checkboxData.id;
      checkboxLabel.htmlFor = checkboxData.id;
      checkboxLabel.textContent = checkboxData.text;
      calculatorCheckboxes.appendChild(checkbox);
    });
  };

  Calculator.prototype.calculateOffer = function () {
    this.maternalCapital = this.root.querySelector('#maternal-capital');
    this.lifeInsurance = this.root.querySelector('#life-insurance');
    this.carInsurance = this.root.querySelector('#car-insurance');
    this.salaryProject = this.root.querySelector('#salary-project');
    this.offer.amountLabel = this.offer.querySelector('#offer-amount h4');
    this.offer.amountValue = this.offer.querySelector('#offer-amount-value');
    this.offer.interestValue = this.offer.querySelector('#offer-interest-value');
    this.offer.annuityValue = this.offer.querySelector('#offer-annuity-value');
    this.offer.incomeValue = this.offer.querySelector('#offer-income-value');

    var calculatorAmount = getIntValue(this.amount.inputNumberField.value);
    var calculatorInitial = getIntValue(this.initial.inputNumberField.value);
    var calculatorInitialRatio = this.initial.inputRangeField.value;
    var calculatorTerm = this.term.inputRangeField.value;
    var offerAmount = calculatorAmount - calculatorInitial;
    var offerInterest = this.parameters['offer-interest-default'];
    var offerInterestMonth = offerInterest / (100 * 12);
    var offerPeriodMonths = calculatorTerm * 12;

    if (this.purpose.value === 'mortgage') {
      if (this.maternalCapital.checked) {
        offerAmount -= this.parameters['offer-maternal-capital'];
      }

      if (calculatorInitialRatio < this.parameters['offer-initial-ratio-breakpoint']) {
        offerInterest = this.parameters['offer-interest-default'];
      } else {
        offerInterest = this.parameters['offer-interest-min'];
      }
    }

    if (this.purpose.value === 'car') {
      if (calculatorAmount >= this.parameters['offer-car-price-breakpoint']) {
        offerInterest = this.parameters['offer-interest-max'];
      }

      if (this.carInsurance.checked && this.lifeInsurance.checked) {
        offerInterest = this.parameters['offer-interest-min'];
      } else if (this.carInsurance.checked || this.lifeInsurance.checked) {
        offerInterest = this.parameters['offer-interest-mid'];
      }
    }

    if (this.purpose.value === 'consumer') {
      offerAmount = calculatorAmount;

      if (calculatorAmount < this.parameters['offer-amount-breakpoint-min']) {
        offerInterest = this.parameters['offer-interest-max'];
      } else if (calculatorAmount < this.parameters['offer-amount-breakpoint-max']) {
        offerInterest = this.parameters['offer-interest-mid'];
      } else {
        offerInterest = this.parameters['offer-interest-min'];
      }

      if (this.salaryProject.checked) {
        offerInterest = offerInterest - this.parameters['offer-interest-bonus'];
      }
    }

    if (offerAmount < this.parameters['offer-amount-min']) {
      this.offer.classList.add('calculator__offer_hidden');
      this.message.classList.remove('message_hidden');
      this.messageCreditName.textContent = this.parameters['offer-message-credit-name'];
      this.messageCreditAmount.textContent = formatNumber(this.parameters['offer-amount-min']);
    } else {
      this.offer.classList.remove('calculator__offer_hidden');
      this.message.classList.add('message_hidden');
    }

    var offerAnnuity = Math.round(offerAmount * (offerInterestMonth + offerInterestMonth / (Math.pow(1 + offerInterestMonth, offerPeriodMonths) - 1)));
    var offerIncome = Math.round(offerAnnuity / this.parameters['offer-income-annuity-ratio']);

    this.offer.amountLabel.textContent = this.parameters['offer-amount-label'];
    this.offer.amountValue.textContent = formatNumber(offerAmount);
    this.offer.interestValue.textContent = offerInterest.toFixed(2).replace('.', ',');
    this.offer.annuityValue.textContent = formatNumber(offerAnnuity);
    this.offer.incomeValue.textContent = formatNumber(offerIncome);
  };

  Calculator.prototype.openApplication = function () {
    this.application.number = this.application.querySelector('#application-number');
    this.application.purpose = this.application.querySelector('#application-purpose');
    this.application.amount = this.application.querySelector('#application-amount');
    this.application.initial = this.application.querySelector('#application-initial');
    this.application.term = this.application.querySelector('#application-term');
    this.application.name = this.application.querySelector('#application-name');
    this.application.phone = this.application.querySelector('#application-phone');
    this.application.email = this.application.querySelector('#application-email');

    this.application.numberMask = IMask(this.application.number, getMaskOptions(this.application.number));
    this.application.amountMask = IMask(this.application.amount, getMaskOptions(this.application.amount));
    this.application.initialMask = IMask(this.application.initial, getMaskOptions(this.application.initial));
    this.application.termMask = IMask(this.application.term, getMaskOptions(this.application.term));
    this.application.phoneMask = IMask(this.application.phone, getMaskOptions(this.application.phone));

    this.application.numberMask.value = String(applicationCount);
    this.application.purpose.value = this.parameters['calculator-purpose'];
    this.application.amountMask.value = String(getIntValue(this.amount.inputNumberField.value));
    this.application.initialMask.value = String(getIntValue(this.initial.inputNumberField.value));
    this.application.termMask.value = String(getIntValue(this.term.inputNumberField.value));

    try {
      this.dataStorage.name = localStorage.getItem('name');
      this.dataStorage.phone = localStorage.getItem('phone');
      this.dataStorage.email = localStorage.getItem('email');
    } catch (err) {
      this.isStorageSupport = false;
    }

    if (this.isStorageSupport) {
      if (this.dataStorage.name && this.dataStorage.phone && this.dataStorage.email) {
        this.application.name.value = this.dataStorage.name;
        this.application.phone.value = this.dataStorage.phone;
        this.application.email.value = this.dataStorage.email;
        this.application.name.focus();
      } else if (this.dataStorage.name && this.dataStorage.phone) {
        this.application.name.value = this.dataStorage.name;
        this.application.phone.value = this.dataStorage.phone;
        this.application.email.focus();
      } else if (this.dataStorage.name && this.dataStorage.email) {
        this.application.name.value = this.dataStorage.name;
        this.application.email.value = this.dataStorage.email;
        this.application.phone.focus();
      } else if (this.dataStorage.phone && this.dataStorage.email) {
        this.application.phone.value = this.dataStorage.phone;
        this.application.email.value = this.dataStorage.email;
        this.application.name.focus();
      } else if (this.dataStorage.name) {
        this.application.name.value = this.dataStorage.name;
        this.application.phone.focus();
      } else if (this.dataStorage.phone) {
        this.application.phone.value = this.dataStorage.phone;
        this.application.name.focus();
      } else {
        this.application.email.value = this.dataStorage.email;
        this.application.name.focus();
      }
    }

    var applicationForm = this.application.querySelector('.application__form');
    var applicationInputs = applicationForm.querySelectorAll('input');

    applicationInputs.forEach(function (input) {
      input.oninput = function () {
        if (input.value) {
          input.classList.remove('input-invalid');
        }
      };
    });

    this.submitButton.addEventListener('click', function () {
      applicationInputs.forEach(function (input) {
        if (!input.value) {
          input.setCustomValidity('Заполните это поле');
          input.classList.add('input-invalid');
        } else {
          input.setCustomValidity('');
          input.classList.remove('input-invalid');
        }
      });
    });

    var calculator = this;

    this.form.onsubmit = function (evt) {
      evt.preventDefault();

      applicationCount += 1;

      if (calculator.isStorageSupport) {
        localStorage.setItem('name', calculator.application.name.value);
        localStorage.setItem('phone', calculator.application.phone.value);
        localStorage.setItem('email', calculator.application.email.value);
      }

      var data = new FormData(evt.target);

      window.server.load(onLoadSuccess, onLoadError, window.server.UPLOAD_URL, data);
    };
  };

  Calculator.prototype.addListeners = function () {
    var calculator = this;

    this.offerButton.addEventListener('click', function (evt) {
      evt.preventDefault();
      calculator.application.classList.remove('calculator__application_hidden');
      calculator.application.scrollIntoView();
      calculator.openApplication();
    });

    this.onAmountInputChange = function (evt) {
      if (calculator.initial) {
        var initialRatio = calculator.initial.inputRangeField.value;

        if (!calculator.amount.isValid) {
          calculator.initial.inputNumberMask.value = '0';
        } else {
          calculator.initial.inputNumberMask.value = getInitialString(initialRatio, evt.target.value);
        }
      }
    };

    this.onAmountInputClick = function (evt) {
      var amountValue = getIntValue(calculator.amount.inputNumberField.value);

      if (evt.target === calculator.amount.inputNumberButtonUp) {
        calculator.amount.inputNumberMask.value = String(amountValue + calculator.parameters['calculator-amount-step']);

        if (amountValue > calculator.parameters['calculator-amount-max']) {
          calculator.amount.inputNumberMask.value = String(calculator.parameters['calculator-amount-max']);
        }
      }

      if (evt.target === calculator.amount.inputNumberButtonDown) {
        calculator.amount.inputNumberMask.value = String(amountValue - calculator.parameters['calculator-amount-step']);

        if (amountValue < calculator.parameters['calculator-amount-min']) {
          calculator.amount.inputNumberMask.value = String(calculator.parameters['calculator-amount-min']);
        }
      }

      if (evt.target === calculator.amount.inputNumberButtonDown || calculator.amount.inputNumberButtonUp) {
        if (!calculator.amount.isValid) {
          calculator.amount.inputNumber.classList.remove('input-number_invalid');
          calculator.amount.inputNumberMask.updateOptions(getMaskOptions(calculator.amount.inputNumberField));
          calculator.amount.inputNumberMask.value = String(calculator.parameters['calculator-amount-min']);
          calculator.amount.isValid = true;
        }
        if (calculator.initial) {
          calculator.initial.inputNumberMask.value = getInitialString(calculator.parameters['calculator-initial-ratio'], calculator.amount.inputNumberField.value);
          calculator.initial.inputRangeField.value = calculator.parameters['calculator-initial-ratio'];
          calculator.initial.inputRangeValue.value = calculator.parameters['calculator-initial-ratio'];
        }
        calculator.calculateOffer();
      }
    };

    this.onInitialInputNumberChange = function () {
      var amountValue = getIntValue(calculator.amount.inputNumberField.value);
      var initialValue = getIntValue(calculator.initial.inputNumberField.value);
      var initialRatioMin = calculator.parameters['calculator-initial-ratio'];

      if (!initialValue || initialValue < initialRatioMin / 100 * amountValue) {
        calculator.initial.inputNumberMask.value = getInitialString(initialRatioMin, amountValue);
        calculator.initial.inputRangeField.value = initialRatioMin;
      } else {
        calculator.initial.inputRangeField.value = (initialValue * 100) / amountValue;
      }

      if (initialValue > amountValue) {
        calculator.initial.inputNumberMask.value = getInitialString(100, amountValue);
      }

      calculator.initial.inputRangeValue.value = calculator.initial.inputRangeField.value;
    };

    this.onInitialInputRangeInput = function (evt) {
      calculator.initial.inputRangeValue.value = evt.target.value;
      calculator.initial.inputNumberMask.value = getInitialString(evt.target.value, calculator.amount.inputNumberField.value);
    };

    this.amount.inputNumber.addEventListener('click', this.onAmountInputClick, true);
    this.amount.inputNumberField.addEventListener('change', this.onAmountInputChange);

    if (this.initial) {
      this.initial.inputNumberField.addEventListener('change', this.onInitialInputNumberChange);
      this.initial.inputRangeField.addEventListener('input', this.onInitialInputRangeInput);
    }
  };

  Calculator.prototype.removeListeners = function () {
    this.amount.inputNumber.removeEventListener('click', this.onAmountInputClick, true);
    this.amount.inputNumberField.removeEventListener('change', this.onAmountInputChange);

    if (this.initial) {
      this.initial.inputNumberField.removeEventListener('change', this.onInitialInputNumberChange);
      this.initial.inputRangeField.removeEventListener('input', this.onInitialInputRangeInput);
    }
  };

  window.calculator = new Calculator('#calculator');

  var onLoadSuccess = function () {
    window.calculator.submitModal.open();
    window.calculator.deactivate();
    window.calculator.root.scrollIntoView();
  };

  var onLoadError = function () {
    window.calculator.deactivate();
  };

})();

'use strict';

document.addEventListener('DOMContentLoaded', function () {
  var Options = {};

  var init = function () {
    var dataUrl = 'data.json';
    var centerCoords = [56.82, 60.59];
    var mapContainer = document.querySelector('#map');
    var mapFilters = document.querySelector('#map-filters-form');

    var yandexMap = new ymaps.Map(mapContainer, {
      center: centerCoords,
      zoom: [5],
      controls: [],
    },
    {
      minZoom: 2,
      autoFitToViewport: 'always',
      suppressMapOpenBlock: true,
    });

    yandexMap.behaviors.disable('scrollZoom');

    yandexMap.controls.add('zoomControl', {
      size: 'small',
      position: {
        top: 200,
        right: 15,
      }
    });

    var objectManager = new ymaps.ObjectManager({
      clusterize: true,
      gridSize: 32,
    });

    objectManager.objects.options.set({
      iconLayout: 'default#image',
      iconImageHref: '/img/icon-pin.svg',
      iconImageSize: [35, 40],
      iconImageOffset: [-17.6, -42]
    });

    var setFilter = function (list) {
      yandexMap.geoObjects.add(objectManager.setFilter(function (item) {
        var param = item.properties.clusterCaption;
        return list[param];
      }));
    };

    var filter = function () {
      var filterElements = mapFilters.querySelectorAll('input[type="checkbox"]');

      filterElements.forEach(function (element) {
        var name = element.getAttribute('name');
        Options[name] = element.checked;
      });
      setFilter(Options);
    };

    var onLoadSuccess = function (data) {
      objectManager.add(data);
      yandexMap.geoObjects.add(objectManager);
      var bounds = objectManager.getBounds();
      if (bounds) {
        yandexMap.setBounds(bounds);
      }
      filter();
    };

    var onLoadError = function (errorText) {
      throw new Error(errorText);
    };

    var onFiltersChange = function () {
      filter();
    };

    window.server.load(onLoadSuccess, onLoadError, dataUrl);
    window.addEventListener('resize', function () {
      if (yandexMap && objectManager) {
        yandexMap.setBounds(objectManager.getBounds());
        yandexMap.container.fitToViewport();
      }
    });
    mapFilters.addEventListener('change', onFiltersChange);
  };

  ymaps.ready(init);
});

'use strict';

var colorSelect = new CustomSelect({
  elem: 'calculator-purpose'
});
