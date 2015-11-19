(function() {
  'use strict';
  angular.module('app')
    .controller('PlaceDetailController', PlaceDetailController);

  PlaceDetailController.$inject = ['U', '$scope', 'Places', 'PlaceDetailModel', 'Message', '$stateParams', 'FavoriteService', 'DaumMapModel', 'Preload'];

  function PlaceDetailController(U, $scope, Places, PlaceDetailModel, Message, $stateParams, FavoriteService, DaumMapModel, Preload) {

    var PlaceDetail = this;
    PlaceDetail.Model = PlaceDetailModel;

    // Used to update place on ion-refresh
    PlaceDetail.isFavorite = FavoriteService.isFavorite;
    PlaceDetail.togglePlace = FavoriteService.togglePlace;
    PlaceDetail.pinSelectedPlace = pinSelectedPlace;
    PlaceDetail.preloadToProductListByPlace = preloadToProductListByPlace;

    $scope.$on('$ionicView.beforeEnter', onBeforeEnter);
    $scope.$on('$ionicView.leave', onLeave);
    //====================================================
    //  Implementation
    //====================================================
    function pinSelectedPlace() {
      var longitude = PlaceDetailModel.place.geoJSON.coordinates[0];
      var latitude = PlaceDetailModel.place.geoJSON.coordinates[1];
      DaumMapModel.selectedPlace.longitude = longitude;
      DaumMapModel.selectedPlace.latitude = latitude;
      U.goToState('main.daumMap', {
        id: PlaceDetailModel.place.id
      });
    }

    function preloadToProductListByPlace() {
      Preload.stateWithProducts('main.placeId', {
        id: PlaceDetailModel.place.id,
        category: 'market'
      }, true, 'forward');
    }
    //====================================================
    //  View states
    //====================================================
    function onBeforeEnter() {
      U.update();
    }

    function onLeave() {
      U.resetSlides();
    }

    //====================================================
    //  Helper
    //====================================================

  } //end
})();
