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
