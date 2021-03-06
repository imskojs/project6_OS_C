(function() {
  'use strict';
  angular.module('app')
    .filter('mToKm', mToKm);

  // distance.$inject=[];

  function mToKm() {
    return function(input) {
      if (input >= 1000) {
        return (input / 1000).toFixed(2) + ' km';
      } else if (input === undefined) {
        return '0 m';
      } else {
        return input + ' m';
      }
    };
  }
})();
