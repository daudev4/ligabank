'use strict';

(function () {
  var WIDTH_TABLET = 768;

  document.body.classList.remove('no-js');

  var menu = function () {
    var root = document.querySelector('.menu');
    var menuButton = root.querySelector('.menu__toggle');
    var menuItems = root.querySelectorAll('.menu__item');

    var onMenuItemClick = function () {
      root.classList.toggle('menu_closed');
      document.body.classList.toggle('no-scroll');
    };

    menuButton.addEventListener('click', function () {
      root.classList.toggle('menu_closed');
      document.body.classList.toggle('no-scroll');
    });

    if (window.innerWidth < WIDTH_TABLET) {
      menuItems.forEach(function (item) {
        item.addEventListener('click', onMenuItemClick);
      });
    }

    window.addEventListener('resize', function () {
      if (window.innerWidth >= WIDTH_TABLET) {
        menuItems.forEach(function (item) {
          item.removeEventListener('click', onMenuItemClick);
        });
      } else {
        menuItems.forEach(function (item) {
          item.addEventListener('click', onMenuItemClick);
        });
      }
    });
  };

  menu();
})();
