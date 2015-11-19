(function() {
  'use strict';
  angular.module('app')
    .filter('stateParamToText', stateParamToText);

  stateParamToText.$inject = [];

  function stateParamToText() {
    return function(param) {
      if (param === 'faq') {
        return '자주 묻는 질문';
      } else if (param === 'notification') {
        return '공지사항';
      }
    };
  }
})();
