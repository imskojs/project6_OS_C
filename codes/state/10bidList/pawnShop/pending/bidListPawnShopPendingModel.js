(function() {
  'use strict';

  angular.module('app')
    .factory('BidListPawnShopPendingModel', BidListPawnShopPendingModel);

  BidListPawnShopPendingModel.$inject = [];

  function BidListPawnShopPendingModel() {

    var model = {
      bids: [],
      more: false
    };
    return model;
  }
})();
