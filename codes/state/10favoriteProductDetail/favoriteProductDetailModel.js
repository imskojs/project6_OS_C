(function() {
  'use strict';

  angular.module('app')
    .factory('FavoriteProductDetailModel', FavoriteProductDetailModel);

  FavoriteProductDetailModel.$inject = [];

  function FavoriteProductDetailModel() {

    var model = {
      product: {
        place: {},
        photos: [],
        createdBy: {}
      }
    };
    return model;
  }
})();
