(function() {
  'use strict';
  angular.module('app')
    .controller('BidDetailPawnShopRespondedController', BidDetailPawnShopRespondedController);

  BidDetailPawnShopRespondedController.$inject = ['BidDetailPawnShopRespondedModel'];

  function BidDetailPawnShopRespondedController(BidDetailPawnShopRespondedModel) {

    var BidDetailPawnShopResponded = this;
    BidDetailPawnShopResponded.Model = BidDetailPawnShopRespondedModel;

  } //end
})();
