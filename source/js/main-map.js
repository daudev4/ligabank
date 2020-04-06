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
      iconImageHref: 'img/icon-pin.svg',
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
