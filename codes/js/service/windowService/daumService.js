(function() {
  'use strict';

  angular.module('app')
    .factory('daum', daum);

  daum.$inject = ['$window'];

  function daum($window) {

    return $window.daum;
  }
})();
