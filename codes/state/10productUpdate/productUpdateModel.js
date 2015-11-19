(function() {
  'use strict';

  angular.module('app')
    .factory('ProductUpdateModel', ProductUpdateModel);

  ProductUpdateModel.$inject = [];

  function ProductUpdateModel() {

    var model = {
      // product properties
      dataUris: [],
      fileUris: [],
      form: {
        name: null,
        productCategory: null,
        brand: null,
        boughtAt: null,
        price: null,
        condition: null,
        showBid: true,
        description: null,
      },
      product: {
        photos: [],
        name: null,
        productCategory: null,
        brand: null,
        boughtAt: null,
        price: null,
        condition: null,
        showBid: true,
        description: null,
      }
    };
    return model;
  }
})();
