(function() {
  'use strict';
  angular.module('app')
    .controller('ProductDetailController', ProductDetailController);

  ProductDetailController.$inject = ['U', '$scope', 'Products', 'ProductDetailModel', 'Message', '$stateParams', 'FavoriteService', '$state', '$ionicSlideBoxDelegate', 'LinkService', 'Preload'];

  function ProductDetailController(U, $scope, Products, ProductDetailModel, Message, $stateParams, FavoriteService, $state, $ionicSlideBoxDelegate, LinkService, Preload) {

    var ProductDetail = this;
    ProductDetail.Model = ProductDetailModel;

    // Used to update product on ion-refresh
    ProductDetail.isFavorite = FavoriteService.isFavorite;
    ProductDetail.toggleProduct = FavoriteService.toggleProduct;
    ProductDetail.call = LinkService.call;
    ProductDetail.preloadToPlaceDetail = preloadToPlaceDetail;

    $scope.$on('$ionicView.beforeEnter', onBeforeEnter);
    $scope.$on('$ionicView.beforeLeave', onLeave);
    //====================================================
    //  Implementation
    //====================================================
    function preloadToPlaceDetail() {
      console.log(ProductDetailModel.market.product.place);
      Preload.stateWithPlaces('main.placeDetail', {
        id: ProductDetailModel.market.product.place.id
      }, true, 'forward');
    }

    function onBeforeEnter() {
      U.update();
      U.resize();
    }

    function onLeave() {
      U.resetSlides();
    }

    //====================================================
    //  Helper
    //====================================================

  } //end
})();
