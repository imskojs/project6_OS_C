// Makes width of the view available as JS or directive such as collection repeat
// This makes collection repeat to have dynamic width or height which depends on
//the view width or view height;

// usage:
// In index.html, body[loading]
// 1) ion-list>ion-item[collection-repeat="item in items" item-height="loading * 0.20"]
// 2) ANY[loading]
// 3) function controller($rootScope){
//     console.log($rootScope.loading);
//    }
(function() {
  'use strict';

  angular.module('app')
    .directive('loading', loading);

  loading.$inject = [];

  function loading() {
    return {
      replace: true,
      template: '<div class="w100p h100vh flex light-grey-bg absolute"style="z-index: 2">' +
        '<ion-spinner class="spinner-40px mb88px" icon="ripple"></ion-spinner>' +
        '</div>'
    };
  }


})();
