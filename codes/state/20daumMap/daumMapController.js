(function() {
  'use strict';

  angular.module('app')
    .controller('DaumMapController', DaumMapController);

  DaumMapController.$inject = ['DaumMapModel', '$ionicModal', '$scope', '$state', '$stateParams', '$timeout', 'Message', 'appStorage', 'Preload'];

  function DaumMapController(DaumMapModel, $ionicModal, $scope, $state, $stateParams, $timeout, Message, appStorage, Preload) {

    var DaumMap = this;
    DaumMap.Model = DaumMapModel;

    DaumMap.searchType = "address";

    DaumMap.findMeThenSearchNearBy = DaumMapModel.findMeThenSearchNearBy;
    DaumMap.searchLocationNearBy = DaumMapModel.searchLocationNearBy;
    DaumMap.setAppStorage = setAppStorage;

    $scope.$on('$ionicView.enter', onEnter);
    $scope.$on('$ionicView.afterEnter', onAfterEnter);
    $scope.$on('$ionicView.afterLeave', onAfterLeave);

    //====================================================
    // Implementation
    //====================================================
    function setAppStorage() {
      var longitude = DaumMapModel.currentPosition.longitude;
      var latitude = DaumMapModel.currentPosition.latitude;
      appStorage.geoJSON.coordinates[0] = longitude;
      appStorage.geoJSON.coordinates[1] = latitude;
      return Preload.stateWithProducts('main.productList.market', {
        category: 'market'
      }, true, 'forward');
    }

    function onEnter() {
      // DaumMapModel.domMap.relayout();
    }

    function onAfterEnter() {
      $timeout(function() {
        DaumMapModel.domMap.relayout();
        if ($state.params.id) {
          DaumMapModel.pinSelectedPlace();
        }
      }, 10);
    }

    function onAfterLeave() {
      if ($state.params.id) {
        DaumMapModel.unPinSelectedPlace();
      }
    }

    //====================================================
    //  Modals
    //====================================================
    $ionicModal.fromTemplateUrl('state/20daumMap/placeModal.html', {
      scope: $scope,
      animation: 'slide-in-up'
    })
      .then(function(modal) {
        DaumMapModel.modal = modal;
      });
  }
})();
