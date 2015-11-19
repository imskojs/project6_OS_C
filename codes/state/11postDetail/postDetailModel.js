(function() {
  'use strict';

  angular.module('app')
    .factory('PostDetailModel', PostDetailModel);

  PostDetailModel.$inject = [];

  function PostDetailModel() {

    var model = {
      market: {
        product: {}
      },
      pawnShop: {
        product: {}
      }
    };
    return model;
  }
})();
