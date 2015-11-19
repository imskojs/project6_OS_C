(function() {
  'use strict';
  angular.module('app')
    .controller('BidListPawnShopPendingController', BidListPawnShopPendingController);

  BidListPawnShopPendingController.$inject = ['BidListPawnShopPendingModel', 'Bids', 'appStorage', 'U', 'Preload', '$scope'];

  function BidListPawnShopPendingController(BidListPawnShopPendingModel, Bids, appStorage, U, Preload, $scope) {

    var BidListPawnShopPending = this;
    BidListPawnShopPending.Model = BidListPawnShopPendingModel;

    BidListPawnShopPending.refreshBids = refreshBids;
    BidListPawnShopPending.getOlderBids = getOlderBids;
    BidListPawnShopPending.deleteBid = deleteBid;
    BidListPawnShopPending.preloadToBidDetailPawnShopPending = preloadToBidDetailPawnShopPending;


    $scope.$on('$ionicView.beforeEnter', function() {
      U.resize();
    });

    function refreshBids() {
      return Bids.find({
          owner: appStorage.place.owner,
          limit: 10,
          status: 'pending',
          sort: 'id DESC',
          populates: ['photos', 'createdBy']
        }).$promise
        .then(function(bidsWrapper) {
          BidListPawnShopPendingModel.bids = bidsWrapper.bids;
          BidListPawnShopPendingModel.more = bidsWrapper.more;
        })
        .catch(U.error)
        .finally(function() {
          $scope.$broadcast('scroll.refreshComplete');
          U.resize();
        });
    }

    function preloadToBidDetailPawnShopPending(bid) {
      Preload.stateWithBids('main.bidDetailPawnShopPending', {
        id: bid.id
      }, true, 'foward')
        .catch(U.error);
    }

    function deleteBid(bid, $index) {
      return Bids.destroy({
          id: bid.id
        }).$promise
        .then(function(bid) {
          console.log(bid);
          BidListPawnShopPendingModel.bids.splice($index, 1);
          U.resize();
        })
        .catch(U.error)
        .finally(function() {
          U.resize();
        });
    }

    function getOlderBids() {
      var last = BidListPawnShopPendingModel.bids.length - 1;
      return Bids.find({
          olderThan: BidListPawnShopPendingModel.bids[last].id,
          owner: appStorage.place.owner,
          limit: 10,
          status: 'pending',
          sort: 'id DESC',
          populates: ['photos', 'createdBy']
        }).$promise
        .then(function(bidsWrapper) {
          angular.forEach(bidsWrapper.bids, function(bid) {
            BidListPawnShopPendingModel.bids.push(bid);
          });
          BidListPawnShopPendingModel.more = bidsWrapper.more;
        })
        .catch(U.error)
        .finally(function() {
          $scope.$broadcast('scroll.infiniteScrollComplete');
          U.resize();
        });

    }
  } //end
})();
