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
