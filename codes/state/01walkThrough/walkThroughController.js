(function() {
  'use strict';
  angular.module('app')
    .controller('WalkThroughController', WalkThroughController);

  WalkThroughController.$inject = ['$scope', 'WalkThroughModel', '$ionicSlideBoxDelegate', '$window', '$state', '$ionicGesture', 'appStorage'];

  function WalkThroughController($scope, WalkThroughModel, $ionicSlideBoxDelegate, $window, $state, $ionicGesture, appStorage) {

    var WalkThrough = this;
    WalkThrough.Model = WalkThroughModel;

    WalkThrough.leaveWalkThrough = leaveWalkThrough;
    WalkThrough.onSlideChange = onSlideChange;

    $scope.$on('$ionicView.beforeEnter', onBeforeEnter);
    $scope.$on('$ionicView.enter', onEnter);

    //====================================================
    //  Implementations
    //====================================================
    function onSlideChange($index) {
      console.log($index);
    }

    function onBeforeEnter() {
      $ionicSlideBoxDelegate.$getByHandle('walk-through-slide').update();
      $ionicSlideBoxDelegate.$getByHandle('walk-through-slide').slide(0, 0);
      $ionicSlideBoxDelegate.$getByHandle('walk-through-slide').enableSlide(true);
    }

    function onEnter() {
      var lastSlideIndex = WalkThroughModel.imagePaths.length - 1;
      var lastSlideElement = angular.element($window.document.querySelector('#slide' + lastSlideIndex));
      $ionicGesture.on('swipeleft', leaveWalkThrough, lastSlideElement);
    }

    //====================================================
    //  Helper
    //====================================================
    function leaveWalkThrough() {
      appStorage.firstTime = false;
      $state.go('main.login');
    }

  }
})();
