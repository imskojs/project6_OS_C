(function() {
  'use strict';

  angular.module('app')
    .factory('BidDetailPawnShopRespondedModel', BidDetailPawnShopRespondedModel);

  BidDetailPawnShopRespondedModel.$inject = [];

  function BidDetailPawnShopRespondedModel() {

    var model = {
      bid: {}
    };
    return model;
  }
})();
