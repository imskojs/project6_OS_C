(function() {
  'use strict';

  angular.module('app')
    .factory('Dom', Dom);

  Dom.$inject = ['$timeout', '$window'];

  function Dom($timeout, $window) {
    var service = {
      focusById: focusById,
      blurById: blurById,
    };

    return service;

    // USAGE;
    // <input id="daum-map-search-input" type="text">
    // Dom.focusById('daum-map-search-input');
    function focusById(id) {
      $timeout(function() {
        var domElement = $window.document.getElementById(id);
        if (domElement) {
          domElement.focus();
        }
      }, 0);
    }

    function blurById(id) {
      $timeout(function() {
        var domElement = $window.document.getElementById(id);
        if (domElement) {
          domElement.blur();
        }
      }, 0);
    }
  }

})();
