// used for setting top value of ion-content 
// needed as ios has 20px difference

(function(angular) {
  'use strict';

  angular.module('app')
    .directive('top', top);

  top.$inject = [];

  function top() {
    return {
      restrict: 'A',
      compile: compile,
      // link: link
    };

    function compile(element, attrs) {
      var height = attrs.top;
      if(ionic.Platform.isIOS()){
        element.css('top', (Number(height) + 20) + 'px' );
      } else {
        element.css('top', Number(height) + 'px');
      }
      return function(){};
    }
  }

})(angular);
