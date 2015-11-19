(function() {
  'use strict';

  angular.module('app')
    .factory('BidListPawnShopRespondedModel', BidListPawnShopRespondedModel);

  BidListPawnShopRespondedModel.$inject = [];

  function BidListPawnShopRespondedModel() {

    var model = {
      bids: [],
      more: false

    };
    return model;
  }
})();
