(function() {
  'use strict';
  angular.module('app')
    .controller('BidListUserController', BidListUserController);

  BidListUserController.$inject = ['$scope', 'Bids', 'BidListUserModel', 'Preload', 'U', '$state', 'appStorage', 'Distance'];

  function BidListUserController($scope, Bids, BidListUserModel, Preload, U, $state, appStorage, Distance) {

    var BidListUser = this;
    BidListUser.Model = BidListUserModel;

    BidListUser.refreshBids = refreshBids;
    BidListUser.preloadToBidDetailUser = preloadToBidDetailUser;
    BidListUser.getOlderBids = getOlderBids;

    $scope.$on('$ionicView.beforeEnter', onBeforeEnter);

    function refreshBids() {
      return Bids.find({
          product: $state.params.product,
          limit: 10,
          sort: 'updatedAt DESC',
          status: 'responded',
          populates: ['photos', 'owner', 'place', 'createdBy']
        }).$promise
        .then(function(bidsWrapper) {
          BidListUserModel.bids = bidsWrapper.bids;
          BidListUserModel.more = bidsWrapper.more;
          var currentLocation = {
            longitude: appStorage.geoJSON.coordinates[0],
            latitude: appStorage.geoJSON.coordinates[1]
          };
          angular.forEach(BidListUserModel.bids, function(bid) {
            var placeLocation = {
              longitude: bid.place.geoJSON.coordinates[0],
              latitude: bid.place.geoJSON.coordinates[1]
            };
            bid.distanceFromCurrent = Distance.between(currentLocation, placeLocation);
          });
        })
        .catch(U.error)
        .finally(function() {
          $scope.$broadcast('scroll.refreshComplete');
          U.resize();
        });
    }

    function preloadToBidDetailUser(bid) {
      return Preload.stateWithBids('main.bidDetailUser', {
          id: bid.id
        }, true, 'forward')
        .catch(U.error);
    }

    function getOlderBids() {
      var last = BidListUserModel.bids.length - 1;
      return Bids.find({
          dateOlderThan: BidListUserModel.bids[last].updatedAt,
          product: $state.params.product,
          limit: 10,
          status: 'responded',
          sort: 'updatedAt DESC',
          populates: ['photos', 'owner', 'place', 'createdBy']
        }).$promise
        .then(function(bidsWrapper) {
          angular.forEach(bidsWrapper.bids, function(bid) {
            BidListUserModel.bids.push(bid);
          });
          BidListUserModel.more = bidsWrapper.more;
          var currentLocation = {
            longitude: appStorage.geoJSON.coordinates[0],
            latitude: appStorage.geoJSON.coordinates[1]
          };
          angular.forEach(BidListUserModel.bids, function(bid) {
            var placeLocation = {
              longitude: bid.place.geoJSON.coordinates[0],
              latitude: bid.place.geoJSON.coordinates[1]
            };
            bid.distanceFromCurrent = Distance.between(currentLocation, placeLocation);
          });
        })
        .catch(U.error)
        .finally(function() {
          $scope.$broadcast('scroll.infiniteScrollComplete');
          U.resize();
        });
    }

    function onBeforeEnter() {
      var currentLocation = {
        longitude: appStorage.geoJSON.coordinates[0],
        latitude: appStorage.geoJSON.coordinates[1]
      };
      angular.forEach(BidListUserModel.bids, function(bid) {
        var placeLocation = {
          longitude: bid.place.geoJSON.coordinates[0],
          latitude: bid.place.geoJSON.coordinates[1]
        };
        bid.distanceFromCurrent = Distance.between(currentLocation, placeLocation);
      });
      U.resize();
    }

  } //end
})();
