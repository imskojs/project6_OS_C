(function() {
  'use strict';
  angular.module('app')
    .controller('MyProductListPawnShopController', MyProductListPawnShopController);

  MyProductListPawnShopController.$inject = [
    'MyProductListPawnShopModel', 'Products',
    'appStorage', '$ionicModal', '$scope', 'U', 'Preload', 'Message'
  ];

  function MyProductListPawnShopController(
    MyProductListPawnShopModel, Products,
    appStorage, $ionicModal, $scope, U, Preload, Message
  ) {

    var MyProductListPawnShop = this;
    MyProductListPawnShop.Model = MyProductListPawnShopModel;

    MyProductListPawnShop.refreshProducts = refreshProducts;
    MyProductListPawnShop.getOlderProducts = getOlderProducts;

    MyProductListPawnShop.deleteProduct = deleteProduct;
    MyProductListPawnShop.preloadToBidListUser = preloadToBidListUser;
    MyProductListPawnShop.preloadToProductUpdateInfo = preloadToProductUpdateInfo;
    MyProductListPawnShop.showChangeStateModal = showChangeStateModal;
    MyProductListPawnShop.changeState = changeState;

    $scope.$on('$ionicView.beforeEnter', function() {
      U.resize();
    });
    //====================================================
    //  Implementation
    //====================================================
    function preloadToProductUpdateInfo(product) {
      Preload.stateWithProducts('main.productUpdate.info', {
        category: 'pawnShop',
        method: 'update',
        section: 'info',
        step: 1,
        id: product.id
      }, true, 'forward')
        .catch(U.error);
    }

    function refreshProducts() {
      return Products.getProducts({
          createdBy: appStorage.user.id,
          category: 'market',
          limit: 10,
          sort: 'id DESC',
          populates: ['photos']
        }).$promise
        .then(function(productsWrapper) {
          MyProductListPawnShopModel.products = productsWrapper.products;
          MyProductListPawnShopModel.more = productsWrapper.more;
        })
        .catch(U.error)
        .finally(function() {
          $scope.$broadcast('scroll.refreshComplete');
        });
    }

    function getOlderProducts() {
      var last = MyProductListPawnShopModel.products.length - 1;
      return Products.getProducts({
          createdBy: appStorage.user.id,
          category: 'market',
          limit: 10,
          olderThan: MyProductListPawnShopModel.products[last].id,
          populates: ['photos']
        }).$promise
        .then(function(productsWrapper) {
          angular.forEach(productsWrapper.products, function(product) {
            MyProductListPawnShopModel.products.push(product);
          });
          MyProductListPawnShopModel.more = productsWrapper.more;
        })
        .catch(U.error)
        .finally(function() {
          $scope.$broadcast('scroll.infiniteScrollComplete');
        });
    }

    function deleteProduct(product, $index) {
      Products.destroy({
        id: product.id
      }).$promise
        .then(function(product) {
          console.log(product);
          MyProductListPawnShopModel.products.splice($index, 1);
          U.resize();
        })
        .catch(U.error);
    }

    function preloadToBidListUser(product) {
      Preload.stateWithBids('main.bidListUser', {
        productId: product.id
      }, true)
        .catch(U.error);
    }

    function changeState(state) {
      Products.updateProduct({}, {
        id: MyProductListPawnShopModel.selectedProduct.id,
        status: state
      }).$promise
        .then(function(products) {
          MyProductListPawnShopModel.selectedProduct.status = products[0].status;
          refreshProducts();
          MyProductListPawnShop.changeStateModal.hide();
        })
        .catch(function(err) {
          MyProductListPawnShop.changeStateModal.hide();
          Message.alert();
        });
    }

    function showChangeStateModal(product) {
      MyProductListPawnShopModel.selectedProduct = product;
      MyProductListPawnShop.changeStateModal.show();
    }
    //====================================================
    //  Modals
    //====================================================
    $ionicModal.fromTemplateUrl('state/10myProductList/modal/changeStateModal.html', {
      scope: $scope,
      animation: 'mh-slide'
    }).then(function(modal) {
      MyProductListPawnShop.changeStateModal = modal;
    });

  } //end
})();
