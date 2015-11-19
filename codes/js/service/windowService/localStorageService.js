(function() {
  'use strict';

  angular.module('app')
    .factory('localStorage', localStorage);

  localStorage.$inject = ['$window'];

  function localStorage($window) {

    return $window.localStorage;
  }
})();
