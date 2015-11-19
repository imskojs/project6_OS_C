(function() {
  'use strict';

  angular.module('app')
    .factory('MyProductListUserModel', MyProductListUserModel);

  MyProductListUserModel.$inject = [];

  function MyProductListUserModel() {

    var model = {
      products: [],
      more: false,
    };
    return model;
  }
})();
