(function() {
  'use strict';
  angular.module('app')
    .controller('FavoriteProductListController', FavoriteProductListController);

  FavoriteProductListController.$inject = ['Products', 'U', 'FavoriteProductListModel', 'appStorage', '$scope', 'Preload'];

  function FavoriteProductListController(Products, U, FavoriteProductListModel, appStorage, $scope, Preload) {

    var FavoriteProductList = this;
    FavoriteProductList.Model = FavoriteProductListModel;

    FavoriteProductList.refreshProducts = refreshProducts;
    FavoriteProductList.getOlderProducts = getOlderProducts;
    FavoriteProductList.preloadToFavoriteProductDetail = preloadToFavoriteProductDetail;

    $scope.$on('$ionicView.beforeEnter', function() {
      U.resize();
    });

    function preloadToFavoriteProductDetail(product) {
      return Preload.stateWithProducts('main.favoriteProductDetail', {
          id: product.id
        }, true, 'forward')
        .catch(U.error);
    }

    function refreshProducts() {
      var favoriteIds = appStorage.favorites;
      return Products.getProducts({
          id: favoriteIds,
          limit: 10,
          sort: 'id DESC',
          populates: ['photos', 'place']
        }).$promise
        .then(function(productsWrapper) {
          FavoriteProductListModel.products = productsWrapper.products;
          FavoriteProductListModel.more = productsWrapper.more;
        })
        .catch(U.error)
        .finally(function() {
          $scope.$broadcast('scroll.refreshComplete');
          U.resize();
        });
    }

    function getOlderProducts() {
      var favoriteIds = appStorage.favorites;
      return Products.getProducts({
          id: favoriteIds,
          skip: FavoriteProductListModel.products.length,
          limit: 10,
          sort: 'id DESC',
          populates: ['photos', 'place']
        }).$promise
        .then(function(productsWrapper) {
          angular.forEach(productsWrapper.products, function(product) {
            FavoriteProductListModel.products.push(product);
          });
          FavoriteProductListModel.more = productsWrapper.more;
        })
        .catch(U.error)
        .finally(function() {
          $scope.$broadcast('scroll.infiniteScrollComplete');
          U.resize();
        });
    }


  } //end
})();
