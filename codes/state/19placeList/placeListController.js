(function() {
  'use strict';
  angular.module('app')
    .controller('PlaceListController', PlaceListController);

  PlaceListController.$inject = ['$scope', 'PlaceListModel', 'U'];

  function PlaceListController($scope, PlaceListModel, U) {

    var PlaceList = this;
    PlaceList.Model = PlaceListModel;

    PlaceList.showPhotos = false;

    $scope.$on('$ionicView.beforeEnter', onBeforeEnter);
    $scope.$on('$ionicView.afterEnter', onAfterEnter);
    $scope.$on('$ionicView.afterLeave', onAfterLeave);
    //====================================================
    //  Implementation
    //====================================================

    //====================================================
    //  View states
    //====================================================
    function onBeforeEnter() {
      U.resize();
    }

    function onAfterEnter() {
      PlaceList.showPhotos = true;
    }

    function onAfterLeave() {
      PlaceList.showPhotos = false;
    }
  }
})();
