(function() {
  'use strict';
  angular.module('app')
    .filter('cloudinary800', cloudinaryFilter.bind(null, 800))
    .filter('cloudinary750', cloudinaryFilter.bind(null, 750))
    .filter('cloudinary700', cloudinaryFilter.bind(null, 700))
    .filter('cloudinary650', cloudinaryFilter.bind(null, 650))
    .filter('cloudinary600', cloudinaryFilter.bind(null, 600))
    .filter('cloudinary550', cloudinaryFilter.bind(null, 550))
    .filter('cloudinary500', cloudinaryFilter.bind(null, 500))
    .filter('cloudinary450', cloudinaryFilter.bind(null, 450))
    .filter('cloudinary400', cloudinaryFilter.bind(null, 400))
    .filter('cloudinary350', cloudinaryFilter.bind(null, 350))
    .filter('cloudinary300', cloudinaryFilter.bind(null, 300))
    .filter('cloudinary250', cloudinaryFilter.bind(null, 250))
    .filter('cloudinary200', cloudinaryFilter.bind(null, 200))
    .filter('cloudinary150', cloudinaryFilter.bind(null, 150))
    .filter('cloudinary100', cloudinaryFilter.bind(null, 100))
    .filter('cloudinary50', cloudinaryFilter.bind(null, 50));

  function cloudinaryFilter(size) {
    var matching = /upload/;
    return function(input) {
      if (input) {
        var index = input.search(matching);
        if (index !== -1) {
          return input.substring(0, index) + 'upload/c_scale,w_' + size + '/' + input.substring(input.lastIndexOf('/'));
        } else {
          return input;
        }
      } else if (input == null) {
        return null;
      } else {
        return input;
      }
    };
  }
})();
