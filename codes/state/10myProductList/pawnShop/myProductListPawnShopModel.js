(function() {
  'use strict';

  angular.module('app')
    .factory('MyProductListPawnShopModel', MyProductListPawnShopModel);

  MyProductListPawnShopModel.$inject = [];

  function MyProductListPawnShopModel() {

    var model = {
      products: [],
      more: false,
      selectedProduct: {}
    };
    return model;
  }
})();
