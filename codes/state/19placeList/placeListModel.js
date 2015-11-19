(function() {
  'use strict';

  angular.module('app')
    .factory('PlaceListModel', PlaceListModel);

  PlaceListModel.$inject = [];

  function PlaceListModel() {

    var model = {
      places: []
    };
    return model;
  }
})();
