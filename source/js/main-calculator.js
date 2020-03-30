'use strict';

(function () {
  var getParameters = function (purpose) {
    var parameters = {};

    switch (purpose) {
      case 'auto':
        parameters = {
          'calculator-type': 'auto',
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
          'calculator-checkbox-text-1': 'Оформить КАСКО в нашем банке',
          'calculator-checkbox-text-2': 'Оформить Страхование жизни в нашем банке',
          'offer-amount-label': 'Сумма автокредита',
          'offer-message-credit-type': 'автокредиты',
        };
        break;

      case 'mortgage':
        parameters = {
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
          'calculator-checkbox-text-1': 'Использование материнского капитала',
          'offer-amount-label': 'Сумма ипотеки',
          'offer-message-credit-type': 'ипотечные кредиты',
        };
        break;

      case 'consumer':
        parameters = {
          'calculator-type': 'consumer',
          'calculator-purpose': 'Потребительский кредит',
          'calculator-amount-label': 'Сумма кредита',
          'calculator-amount-max': 3000000,
          'calculator-amount-min': 50000,
          'calculator-amount-step': 50000,
          'calculator-term-min': 5,
          'calculator-term-max': 7,
          'calculator-term-step': 1,
          'calculator-checkbox-text-1': 'Участник зарплатного проекта нашего банка',
          'offer-amount-label': 'Сумма кредита',
          'offer-message-credit-type': 'потребительские кредиты',
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
    }
    return maskOptions;
  };

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

  var CalculatorItem = function (rootSelector, parameters) {
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
    this.setParameters(parameters);
    this.addHandlers(parameters);
    this.addListeners();
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
        item.inputNumber.classList.remove('input-number_invalid');
        item.inputNumberMask.updateOptions(getMaskOptions(item.inputNumberField));
        item.inputNumberMask.value = String(parameters['calculator-amount-min']);
        item.isValid = true;
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

  CalculatorItem.prototype.addListeners = function () {
    this.removeListeners();

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
    this.purpose = this.root.querySelector('#calculator-purpose');
    this.stepTwo = this.root.querySelector('.calculator__step_two');
    this.offer = this.root.querySelector('.calculator__offer');
    this.offerButton = this.offer.querySelector('.calculator__offer-button');
    this.application = this.root.querySelector('.calculator__application');
    this.modal = this.root.querySelector('.calculator__modal');
    this.submitButton = this.root.querySelector('.calculator__submit');
    this.submitModal = new window.Modal(this.modal, this.submitButton);
    this.purpose.addEventListener('change', function () {
      calculator.deactivate();

      if (calculator.purpose.value !== 'none') {
        calculator.activate();
      }
    });
  };

  Calculator.prototype.activate = function () {
    this.stepTwo.classList.remove('calculator__step_hidden');
    this.offer.classList.remove('calculator__offer_hidden');
    this.parameters = getParameters(this.purpose.value);
    this.amount = new CalculatorItem('#calculator-amount', this.parameters);
    this.initial = new CalculatorItem('#calculator-initial', this.parameters);
    this.root.querySelector('#calculator-initial').classList.remove('form__item_hidden');
    if (this.purpose.value === 'consumer') {
      this.initial = null;
      this.root.querySelector('#calculator-initial').classList.add('form__item_hidden');
    }
    this.term = new CalculatorItem('#calculator-term', this.parameters);
    this.addListeners();
  };

  Calculator.prototype.deactivate = function () {
    this.removeListeners();
    this.stepTwo.classList.add('calculator__step_hidden');
    this.offer.classList.add('calculator__offer_hidden');
    this.application.classList.add('calculator__application_hidden');
    this.parameters = null;
    this.amount = null;
    this.initial = null;
    this.term = null;
  };

  Calculator.prototype.addListeners = function () {
    var calculator = this;

    this.submitButton.addEventListener('click', function () {
      calculator.deactivate();
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

        if (getIntValue(calculator.amount.inputNumberField.value) > calculator.parameters['calculator-amount-max']) {
          calculator.amount.inputNumberMask.value = String(calculator.parameters['calculator-amount-max']);
        }
      }

      if (evt.target === calculator.amount.inputNumberButtonDown) {
        calculator.amount.inputNumberMask.value = String(amountValue - calculator.parameters['calculator-amount-step']);

        if (getIntValue(calculator.amount.inputNumberField.value) < calculator.parameters['calculator-amount-min']) {
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

    this.offerButton.addEventListener('click', function (evt) {
      evt.preventDefault();
      calculator.application.classList.remove('calculator__application_hidden');
    });

    this.amount.inputNumber.addEventListener('click', this.onAmountInputClick, true);
    this.amount.inputNumberField.addEventListener('change', this.onAmountInputChange);

    if (this.initial) {
      this.initial.inputNumberField.addEventListener('change', this.onInitialInputNumberChange);
      this.initial.inputRangeField.addEventListener('input', this.onInitialInputRangeInput);
    }

  };

  Calculator.prototype.removeListeners = function () {
    if (this.amount) {
      this.amount.inputNumber.removeEventListener('click', this.onAmountInputClick, true);
      this.amount.inputNumberField.removeEventListener('change', this.onAmountInputChange);
    }

    if (this.initial) {
      this.initial.inputNumberField.removeEventListener('change', this.onInitialInputNumberChange);
      this.initial.inputRangeField.removeEventListener('input', this.onInitialInputRangeInput);
    }
  };

  window.calculator = new Calculator('#calculator');
})();
