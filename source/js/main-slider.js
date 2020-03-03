'use strict';

var swiper = new Swiper('.banner__slider', {
  slidesPerView: 'auto',
  centeredSlides: true,
  loop: true,
  spaceBetween: 40,
  autoplay: {
    delay: 4000,
    disableOnInteraction: false,
  },
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
  }
});
