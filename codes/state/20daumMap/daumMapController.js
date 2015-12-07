(function() {
  'use strict';

  angular.module('app')
    .controller('DaumMapController', DaumMapController);

  DaumMapController.$inject = [
    '$ionicModal', '$scope', '$state', '$stateParams', '$timeout',
    'DaumMapModel', 'Message', 'appStorage', 'Preload', 'ProductRegisterModel'
  ];

  function DaumMapController(
    $ionicModal, $scope, $state, $stateParams, $timeout,
    DaumMapModel, Message, appStorage, Preload, ProductRegisterModel
  ) {

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
      console.log("---------- $state.params.prev ----------");
      console.log($state.params.prev);
      console.log("HAS TYPE: " + typeof $state.params.prev);

      if ($state.params.prev === 'main.productRegister.step2') {
        ProductRegisterModel.locationSelected = true;
        return $state.go('main.productRegister.step2', {
          category: 'user',
          method: 'create',
          step: 2
        });
      }
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
