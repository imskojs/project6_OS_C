(function() {
  'use strict';

  angular.module('app')
    .factory('FavoriteProductListModel', FavoriteProductListModel);

  FavoriteProductListModel.$inject = [];

  function FavoriteProductListModel() {

    var model = {
      products: [],
      more: false
    };
    return model;
  }
})();
