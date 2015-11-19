//====================================================
// createdBy;
// Seunghoon Ko (imskojs@gmail.com)
//====================================================
(function() {
  'use strict';

  angular.module('app')
    .factory('FavoriteService', FavoriteService);

  FavoriteService.$inject = ['appStorage', 'Products', 'Posts'];

  function FavoriteService(appStorage, Products, Posts) {

    var service = {
      likeProduct: likeProduct,
      unlikeProduct: unlikeProduct,
      likePost: likePost,
      unlikePost: unlikePost,
      toggleProduct: toggleProduct,
      togglePost: togglePost,
      toggleSaveToFavorite: toggleSaveToFavorite,
      isFavorite: isFavorite
    };

    return service;

    //====================================================
    //  Implementation
    //====================================================

    function likePost(postId) {
      return Posts
        .like({
          id: postId
        }).$promise;
    }

    function unlikePost(postId) {
      return Posts
        .unlike({
          id: postId
        }).$promise;
    }

    function likeProduct(id) {
      return Products
        .like({
          id: id
        }).$promise;
    }

    function unlikeProduct(id) {
      return Products
        .unlike({
          id: id
        }).$promise;
    }

    function toggleProduct(id) {
      var promise;
      if (isFavorite(id)) {
        promise = unlikeProduct(id);
      } else if (!isFavorite(id)) {
        promise = likeProduct(id);
      }
      return promise
        .then(function success(product) {
          toggleSaveToFavorite(id);
          return product;
        })
        .catch(function error(err) {
          console.log(err);
        });
    }

    function togglePost(postId) {
      var promise;
      if (isFavorite(postId)) {
        promise = unlikePost(postId);
      } else if (!isFavorite(postId)) {
        promise = likePost(postId);
      }
      return promise
        .then(function success(post) {
          toggleSaveToFavorite(postId);
          return post;
        })
        .catch(function error(err) {
          console.log(err);
        });
    }

    //====================================================
    //  FavoriteService.toggleSaveToFavorite
    //====================================================
    // Usage;
    //FavoriteService.toggleFavorite('1asf31sf1adf31')
    // Output(localStorage favorites array);
    //appStoragefavorites.
    function toggleSaveToFavorite(id) {
      if (!Array.isArray(appStorage.favorites)) {
        appStorage.favorites = [];
      }
      if (isFavorite(id)) { //delte favorite
        var index = appStorage.favorites.indexOf(id);
        appStorage.favorites.splice(index, 1);
      } else if (!isFavorite(id)) { // add favorite
        appStorage.favorites.push(id);
      }
      return appStorage.favorites;
    }


    //====================================================
    //  FavoriteService.isFavorite
    //====================================================
    // Usage;
    //FavoriteService.isFavorite('1asf31sf1adf31')
    // Output(boolean if id exists in appStorage.favorites);
    //true || false
    function isFavorite(id) {
      if (!Array.isArray(appStorage.favorites)) {
        appStorage.favorites = [];
      }
      for (var i = 0; i < appStorage.favorites.length; i++) {
        if (String(id) === String(appStorage.favorites[i])) {
          return true;
        }
      }
      return false;
    }

  } // Service END
})();
