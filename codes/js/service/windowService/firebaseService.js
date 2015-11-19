(function() {
  'use strict';

  angular.module('app')
    .factory('Firebase', Firebase);

  Firebase.$inject = ['$window'];

  function Firebase($window) {
    return $window.Firebase;
  }
})();
