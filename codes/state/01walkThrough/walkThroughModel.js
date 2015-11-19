(function() {
  'use strict';

  angular.module('app')
    .factory('WalkThroughModel', WalkThroughModel);

  WalkThroughModel.$inject = [];

  function WalkThroughModel() {

    var model = {
      imagePaths: [
        'img/walkthrough_01.png',
        'img/walkthrough_02.png',
        'img/walkthrough_03.png'
      ]
    };
    return model;
  }
})();
