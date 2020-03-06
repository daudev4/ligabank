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
