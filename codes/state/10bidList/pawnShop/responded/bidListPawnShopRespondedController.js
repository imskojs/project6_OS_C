(function() {
  'use strict';
  angular.module('app')
    .controller('BidListPawnShopRespondedController', BidListPawnShopRespondedController);

  BidListPawnShopRespondedController.$inject = ['BidListPawnShopRespondedModel', 'Bids', 'appStorage', 'U', 'Preload', '$scope'];

  function BidListPawnShopRespondedController(BidListPawnShopRespondedModel, Bids, appStorage, U, Preload, $scope) {

    var BidListPawnShopResponded = this;
    BidListPawnShopResponded.Model = BidListPawnShopRespondedModel;

    BidListPawnShopResponded.refreshBids = refreshBids;
    BidListPawnShopResponded.getOlderBids = getOlderBids;
    BidListPawnShopResponded.deleteBid = deleteBid;
    BidListPawnShopResponded.preloadToBidDetailPawnShopResponded = preloadToBidDetailPawnShopResponded;


    $scope.$on('$ionicView.beforeEnter', function() {
      U.resize();
    });


    function refreshBids() {
      return Bids.find({
          owner: appStorage.place.owner,
          limit: 10,
          status: 'responded',
          sort: 'id DESC',
          populates: ['photos', 'createdBy']
        }).$promise
        .then(function(bidsWrapper) {
          BidListPawnShopRespondedModel.bids = bidsWrapper.bids;
          BidListPawnShopRespondedModel.more = bidsWrapper.more;
        })
        .catch(U.error)
        .finally(function() {
          $scope.$broadcast('scroll.refreshComplete');
          U.resize();
        });
    }

    function preloadToBidDetailPawnShopResponded(bid) {
      Preload.stateWithBids('main.bidDetailPawnShopResponded', {
        id: bid.id
      }, true, 'forward')
        .catch(U.error);
    }

    function deleteBid(bid, $index) {
      return Bids.destroy({
          id: bid.id
        }).$promise
        .then(function(bid) {
          console.log(bid);
          BidListPawnShopRespondedModel.bids.splice($index, 1);
          U.resize();
        })
        .catch(U.error)
        .finally(function() {
          U.resize();
        });
    }

    function getOlderBids() {
      var last = BidListPawnShopRespondedModel.bids.length - 1;
      return Bids.find({
          olderThan: BidListPawnShopRespondedModel.bids[last].id,
          owner: appStorage.place.owner,
          limit: 10,
          status: 'pending',
          sort: 'id DESC',
          populates: ['photos', 'createdBy']
        }).$promise
        .then(function(bidsWrapper) {
          angular.forEach(bidsWrapper.bids, function(bid) {
            BidListPawnShopRespondedModel.bids.push(bid);
          });
          BidListPawnShopRespondedModel.more = bidsWrapper.more;
        })
        .catch(U.error)
        .finally(function() {
          $scope.$broadcast('scroll.infiniteScrollComplete');
          U.resize();
        });
    }

  } //end
})();
