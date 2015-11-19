// Usage;
// $scope.$on('$ionicView.beforeEnter', onBeforeEnter);
//
// function onBeforeEnter(){
//   return ImagePreload.preload([
//     'http://placehold.it/1000x1000',
//     'http://placehold.it/1200x1200',
//     'http://placehold.it/1200x1200',
//     'http://placehold.it/1200x1200'
//   ])
//   .then(function (){
//     console.log('images fetched and cached before view enter');
//   });
// }
(function() {
  'use strict';
  angular.module('app')

  .factory('ImagePreload', ImagePreload);

  ImagePreload.$inject = ['$q'];

  function ImagePreload($q) {
    var service = {
      preload: preload
    };
    return service;

    function preload(urls) {
      var promises = [];
      var images = [];
      angular.forEach(urls, function(url) {
        var deferred = $q.defer();
        var img = new Image();
        img.onload = onImageLoad(deferred);
        img.onerror = onImageError(deferred, url);
        promises.push(deferred.promise);
        img.src = url;
        images.push(img);
      });
      return $q.all(promises);
      //====================================================
      //  helper
      //====================================================
      function onImageLoad(deferred) {
        return function() {
          deferred.resolve();
        };
      }

      function onImageError(deferred, url) {
        return function() {
          deferred.reject(url);
        };
      }
    }

  } //end
})();
