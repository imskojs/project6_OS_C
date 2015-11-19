(function() {
  'use strict';
  angular.module('app')
    .factory('DaumMapModel', DaumMapModel);

  function DaumMapModel() {
    var model = {
      currentPosition: {
        latitude: 37.498085435791786,
        longitude: 127.02800027507125
      },
      markers: [],
      places: [],
      selectedPlace: {},
      modal: {},
      findMeThenSearchNearBy: function() {},
      searchLocationNearBy: function() {},
      pinSelectedPlace: function() {},
      unPinSelectedPlace: function() {}
    };

    return model;
  }
})();
