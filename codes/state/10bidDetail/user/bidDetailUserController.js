(function() {
  'use strict';
  angular.module('app')
    .controller('BidDetailUserController', BidDetailUserController);

  BidDetailUserController.$inject = [
    'BidDetailUserModel', 'Preload'
  ];

  function BidDetailUserController(
    BidDetailUserModel, Preload
  ) {

    var BidDetailUser = this;
    BidDetailUser.Model = BidDetailUserModel;

    BidDetailUser.preloadToPlaceDetail = preloadToPlaceDetail;

    //====================================================
    //  Implementation
    //====================================================
    function preloadToPlaceDetail() {
      console.log(BidDetailUserModel.bid.place);
      Preload.stateWithPlaces('main.placeDetail', {
        id: BidDetailUserModel.bid.place
      }, true, 'forward');
    }

  } //end
})();