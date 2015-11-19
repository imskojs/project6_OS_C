(function() {
  'use strict';
  angular.module('app')
    .controller('BidDetailUserController', BidDetailUserController);

  BidDetailUserController.$inject = ['BidDetailUserModel'];

  function BidDetailUserController(BidDetailUserModel) {

    var BidDetailUser = this;
    BidDetailUser.Model = BidDetailUserModel;

  } //end
})();
