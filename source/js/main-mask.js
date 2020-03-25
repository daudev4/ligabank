/*eslint-disable*/

'use strict';

(function () {
  var masks = {};
  var inputs = document.querySelectorAll('input[data-unit]');

  var getMaskOptions = function (input) {
    var maskUnit = input.getAttribute('data-unit');
    var maskOption;

    switch (maskUnit) {
      case "currency":
        return maskOption = {
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
        return maskOption = {
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
        return maskOption = {
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
  };

  inputs.forEach(function (input) {
    var maskId = input.getAttribute('id');
    masks[maskId] = IMask(input, getMaskOptions(input));
  });

  window.masks = masks;
  window.getMaskOptions = getMaskOptions;
})();
