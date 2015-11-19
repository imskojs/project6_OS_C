(function() {
  'use strict';
  angular.module('app')
    .controller('FavoriteProductDetailController', FavoriteProductDetailController);

  FavoriteProductDetailController.$inject = ['U', '$scope', 'Products', 'FavoriteProductDetailModel', 'Message', '$stateParams', 'FavoriteService', '$state', '$ionicSlideBoxDelegate', 'LinkService', 'Preload'];

  function FavoriteProductDetailController(U, $scope, Products, FavoriteProductDetailModel, Message, $stateParams, FavoriteService, $state, $ionicSlideBoxDelegate, LinkService, Preload) {

    var FavoriteProductDetail = this;
    FavoriteProductDetail.Model = FavoriteProductDetailModel;

    // Used to update product on ion-refresh
    FavoriteProductDetail.isFavorite = FavoriteService.isFavorite;
    FavoriteProductDetail.toggleProduct = FavoriteService.toggleProduct;
    FavoriteProductDetail.call = LinkService.call;
    FavoriteProductDetail.preloadToPlaceDetail = preloadToPlaceDetail;

    $scope.$on('$ionicView.beforeEnter', onBeforeEnter);
    $scope.$on('$ionicView.beforeLeave', onLeave);
    //====================================================
    //  Implementation
    //====================================================
    function preloadToPlaceDetail() {
      console.log(FavoriteProductDetailModel.product.place);
      Preload.stateWithPlaces('main.placeDetail', {
        id: FavoriteProductDetailModel.product.place.id
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
