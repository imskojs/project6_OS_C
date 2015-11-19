(function() {
  'use strict';

  angular.module('app')
    .factory('BidDetailPawnShopPendingModel', BidDetailPawnShopPendingModel);

  BidDetailPawnShopPendingModel.$inject = [];

  function BidDetailPawnShopPendingModel() {

    var model = {
      bid: {},
      form: {}
    };
    return model;
  }
})();
