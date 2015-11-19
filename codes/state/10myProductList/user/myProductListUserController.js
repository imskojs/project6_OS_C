(function() {
  'use strict';
  angular.module('app')
    .controller('MyProductListUserController', MyProductListUserController);

  MyProductListUserController.$inject = [
    'MyProductListUserModel', 'Products',
    'appStorage', '$ionicModal', '$scope', 'U', 'Preload'
  ];

  function MyProductListUserController(
    MyProductListUserModel, Products,
    appStorage, $ionicModal, $scope, U, Preload
  ) {

    var MyProductListUser = this;
    MyProductListUser.Model = MyProductListUserModel;

    MyProductListUser.refreshProducts = refreshProducts;
    MyProductListUser.getOlderProducts = getOlderProducts;

    MyProductListUser.deleteProduct = deleteProduct;
    MyProductListUser.preloadToBidListUser = preloadToBidListUser;

    $scope.$on('$ionicView.beforeEnter', function() {
      U.resize();
    });
    //====================================================
    //  Implementation
    //====================================================
    function refreshProducts() {
      return Products.getProducts({
          createdBy: appStorage.user.id,
          category: 'pawnShop',
          limit: 10,
          sort: 'id DESC',
          populates: ['photos']
        }).$promise
        .then(function(productsWrapper) {
          MyProductListUserModel.products = productsWrapper.products;
          MyProductListUserModel.more = productsWrapper.more;
        })
        .catch(U.error)
        .finally(function() {
          $scope.$broadcast('scroll.refreshComplete');
        });
    }

    function getOlderProducts() {
      var last = MyProductListUserModel.products.length - 1;
      return Products.getProducts({
          createdBy: appStorage.user.id,
          category: 'pawnShop',
          limit: 10,
          olderThan: MyProductListUserModel.products[last].id,
          populates: ['photos']
        }).$promise
        .then(function(productsWrapper) {
          angular.forEach(productsWrapper.products, function(product) {
            MyProductListUserModel.products.push(product);
          });
          MyProductListUserModel.more = productsWrapper.more;
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
          MyProductListUserModel.products.splice($index, 1);
          U.resize();
        })
        .catch(U.error);
    }

    function preloadToBidListUser(product) {
      Preload.stateWithBids('main.bidListUser', {
        product: product.id
      }, true)
        .catch(U.error);
    }
    //====================================================
    //  Modals
    //====================================================
    $ionicModal.fromTemplateUrl('state/10myProductList/modal/changeStateModal.html', {
      scope: $scope,
      animation: 'mh-slide'
    }).then(function(modal) {
      MyProductListUser.changeStateModal = modal;
    });

  } //end
})();
