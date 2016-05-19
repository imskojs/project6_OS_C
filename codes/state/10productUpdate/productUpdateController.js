(function() {
  'use strict';
  angular.module('app')
    .controller('ProductUpdateController', ProductUpdateController);

  ProductUpdateController.$inject = ['U', '$scope', 'Products', 'ProductUpdateModel', 'Message',
    '$state', '$ionicModal', '$timeout', 'ImageService', 'appStorage', 'Preload', '$filter'
  ];

  function ProductUpdateController(U, $scope, Products, ProductUpdateModel, Message,
    $state, $ionicModal, $timeout, ImageService, appStorage, Preload, $filter
  ) {

    var ProductUpdate = this;
    ProductUpdate.Model = ProductUpdateModel;

    ProductUpdate.sendUpdate = sendUpdate;

    $scope.$on('$ionicView.beforeEnter', onBeforeEnter);
    //====================================================
    //  Implementation
    //====================================================
    function sendUpdate() {
      Message.loading();
      ProductUpdateModel.form.geoJSON = appStorage.place.geoJSON;

      if (ProductUpdateModel.dataUris.length > 0) {
        delete ProductUpdateModel.product.photos;
      }
      delete ProductUpdateModel.product.$promise;
      delete ProductUpdateModel.product.$resolved;
      ImageService.post({
          url: '/product',
          dataUris: ProductUpdateModel.dataUris,
          fields: ProductUpdateModel.product
        }, 'PUT')
        .then(function(productData) {
          console.log(productData);
          return Preload.stateWithProducts('main.myProductListPawnShop', {
            category: 'pawnShop'
          }, false);
        })
        .then(function(photos) {
          console.log(photos);
          Message.hide();
          return Message.alert(
            $filter('translate')('PRODUCT_UPDATE_SUCCESS'),
            $filter('translate')('MOVE_TO_MY_PRODUCT')
          );
        })
        .then(function() {
          U.goToState('main.myProductListPawnShop', {
            category: 'pawnShop'
          });
          U.reset(ProductUpdateModel.product);
          U.reset(ProductUpdateModel.dataUris);
          U.reset(ProductUpdateModel.fileUris);
        })
        .catch(function(err) {
          console.log(err);
          Message.alert();
          U.reset(ProductUpdateModel.product);
          U.reset(ProductUpdateModel.dataUris);
          U.reset(ProductUpdateModel.fileUris);
        });
    }

    //====================================================
    //  View states
    //====================================================
    function onBeforeEnter() {
      U.resize();
    }


    //====================================================
    //  Helper
    //====================================================

  } //end
})();
