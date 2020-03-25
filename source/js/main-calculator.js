'use strict';

(function () {
  var Storage = {
    auto: {
      'credit-purpose': 'Автокредит',
      'credit-amount-label': 'Стоимость автомобиля',
      'credit-amount-max': 5000000,
      'credit-amount-min': 500000,
      'credit-amount-step': 50000,
      'credit-initial-step': 5,
      'credit-initial-ratio': 20,
      'credit-term-max': 5,
      'credit-term-min': 1,
      'credit-term-step': 1,
      'credit-checkbox-text-1': 'Оформить КАСКО в нашем банке',
      'credit-checkbox-text-2': 'Оформить Страхование жизни в нашем банке',
      'offer-amount-label': 'Сумма автокредита',
      'offer-message-credit-type': 'автокредиты',
    },

    mortgage: {
      'credit-purpose': 'Ипотека',
      'credit-amount-label': 'Стоимость недвижимости',
      'credit-amount-max': 25000000,
      'credit-amount-min': 1200000,
      'credit-amount-step': 100000,
      'credit-initial-step': 5,
      'credit-initial-ratio': 10,
      'credit-term-max': 30,
      'credit-term-min': 5,
      'credit-term-step': 1,
      'credit-checkbox-text-1': 'Использование материнского капитала',
      'offer-amount-label': 'Сумма ипотеки',
      'offer-message-credit-type': 'ипотечные кредиты',
    },

    consumer: {
      'credit-purpose': 'Потребительский кредит',
      'credit-amount-label': 'Сумма кредита',
      'credit-amount-max': 3000000,
      'credit-amount-min': 50000,
      'credit-amount-step': 50000,
      'credit-term-max': 7,
      'credit-term-min': 5,
      'credit-term-step': 1,
      'credit-checkbox-text-1': 'Участник зарплатного проекта нашего банка',
      'offer-amount-label': 'Сумма кредита',
      'offer-message-credit-type': 'потребительские кредиты',
    },
  };

  var calculator = document.querySelector('.calculator');
  var calculatorSelect = calculator.querySelector('#calculator-purpose');
  var calculatorStepOne = calculator.querySelector('.calculator__step_one');
  var calculatorStepTwo = calculator.querySelector('.calculator__step_two');
  var calculatorStepThree = calculator.querySelector('.calculator__step_three');
  var calculatorApplication = calculator.querySelector('.calculator__application');
  var calculatorOffer = calculator.querySelector('.calculator__offer');
  var calculatorOfferButton = calculatorOffer.querySelector('.calculator__offer-button');
  var calculatorModal = calculator.querySelector('.calculator__modal');
  var calculatorSubmitButton = calculator.querySelector('.calculator__submit');
  var calculatorSubmitModal = new window.Modal(calculatorModal, calculatorSubmitButton);

  calculatorSelect.addEventListener('change', function () {
    if (calculatorSelect.value !== 'none') {
      calculatorStepTwo.classList.remove('calculator__step_hidden');
      calculatorOffer.classList.remove('calculator__offer_hidden');
    }
  });

  calculatorOfferButton.addEventListener('click', function (evt) {
    evt.preventDefault();
    calculatorApplication.classList.remove('calculator__application_hidden');
  });

  var inputNumber = function (rootClass, parameters) {
    var root = calculator.querySelector(rootClass);
    var field = root.querySelector('input[type="text"]');
    var fieldIsValid = true;

    var buttonDown = root.querySelector('.input-number__button_down');
    var buttonUp = root.querySelector('.input-number__button_up');

    var changeInputValue = function (operation) {
      var fieldValue = parseInt(field.value.split(' ').join(''), 10);

      if (operation === 'increase') {
        field.value = fieldValue + parameters['credit-amount-step'];
      } else if (operation === 'decrease') {
        field.value = fieldValue - parameters['credit-amount-step'];
      }
    };

    var onFieldChange = function () {
      var fieldValue = parseInt(field.value.split(' ').join(''), 10);

      if (fieldValue > parameters['credit-amount-max'] || fieldValue < parameters['credit-amount-min']) {
        window.masks['calculator-amount'].updateOptions({mask: String});
        window.masks['calculator-amount'].value = 'Некорректное значение';
        fieldIsValid = false;
      }

      if (fieldIsValid === false) {
        root.classList.add('input-number_invalid');
      } else {
        root.classList.remove('input-number_invalid');
      }
    };

    var onFieldFocus = function () {
      root.classList.remove('input-number_invalid');
    };

    var onFieldBlur = function () {
      if (fieldIsValid === false) {
        root.classList.add('input-number_invalid');
      }
    };

    var onButtonUpClick = function (evt) {
      evt.preventDefault();
      changeInputValue('increase');
    };

    var onButtonDownClick = function (evt) {
      evt.preventDefault();
      changeInputValue('decrease');
    };

    field.addEventListener('change', onFieldChange);
    field.addEventListener('focus', onFieldFocus);
    field.addEventListener('blud', onFieldBlur);
    buttonUp.addEventListener('click', onButtonUpClick);
    buttonDown.addEventListener('click', onButtonDownClick);
  };

  inputNumber('.input-number', Storage.mortgage);

  var calculateAnnuityPayment = function (amount, interest, period) {
    return amount * (interest / 1 - (1 + Math.pow(interest, -period)));
  };
})();
