(function() {
  'use strict';

  angular.module('app')
    .factory('ProductDetailModel', ProductDetailModel);

  ProductDetailModel.$inject = [];

  function ProductDetailModel() {

    var model = {
      market: {
        product: {}
      },
      pawnShop: {
        product: {}
      },
      product: {}
    };
    return model;
  }
})();
