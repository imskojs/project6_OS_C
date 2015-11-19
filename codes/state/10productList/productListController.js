(function() {
  'use strict';
  angular.module('app')
    .controller('ProductListController', ProductListController);

  ProductListController.$inject = ['U', '$scope', 'Products', 'ProductListModel', 'Message', '$ionicHistory', '$stateParams', '$ionicModal', '$timeout', '$state', 'AppService', 'Preload', 'Dom', 'appStorage'];

  function ProductListController(U, $scope, Products, ProductListModel, Message, $ionicHistory, $stateParams, $ionicModal, $timeout, $state, AppService, Preload, Dom, appStorage) {

    var ProductList = this;
    ProductList.Model = ProductListModel;

    ProductList.showPhotos = false;
    console.log('reinst?');

    ProductList.searchProduct = searchProduct;
    ProductList.preloadToMarket = preloadToMarket;
    ProductList.preloadToPawnShop = preloadToPawnShop;
    ProductList.refreshProducts = refreshProducts;
    ProductList.getFurtherProducts = getFurtherProducts;
    ProductList.preloadToMarketProductDetail = preloadToMarketProductDetail;
    ProductList.preloadToPawnShopProductDetail = preloadToPawnShopProductDetail;

    ProductList.getNewerProducts = getNewerProducts;
    ProductList.getOlderProducts = getOlderProducts;
    ProductList.getOlderPawnShopProducts = getOlderPawnShopProducts;
    ProductList.onlyForUser = onlyForUser;

    // APP SPECIFIC
    ProductList.goToRegisterHandler = goToRegisterHandler;

    $scope.$on('$ionicView.beforeEnter', function() {
      U.resize();
    });

    $scope.$on('$ionicView.beforeEnter', onBeforeEnter);
    $scope.$on('$ionicView.afterEnter', onAfterEnter);
    $scope.$on('$ionicView.afterLeave', onAfterLeave);
    //====================================================
    //  Implementation
    //====================================================
    function onlyForUser() {
      return Message.alert('견적요청 알림', '일반유저만 견적을 요청할수있습니다.');
    }

    function searchProduct() {
      Message.loading();
      return Products.getProductsWithin({
          category: $state.params.category,
          longitude: appStorage.geoJSON.coordinates[0],
          latitude: appStorage.geoJSON.coordinates[1],
          distance: 8000,
          filter: ProductListModel.searchWord,
          limit: 10,
          populates: ['photos', 'place']
        }).$promise
        .then(function(productsWrapper) {
          if ($state.params.category === 'market') {
            ProductListModel.market.products = productsWrapper.products;
            ProductListModel.market.more = productsWrapper.more;
          } else if ($state.params.category === 'pawnShop') {
            ProductListModel.pawnShop.products = productsWrapper.products;
            ProductListModel.pawnShop.more = productsWrapper.more;
          }
          Dom.blurById('search');
          Message.hide();
        });
    }

    function preloadToMarket() {
      ProductListModel.searchWord = null;
      return Preload.stateWithProducts('main.productList.market', {
          category: 'market'
        }, true, 'back')
        .catch(U.error);
    }

    function preloadToPawnShop() {
      ProductListModel.searchWord = null;
      return Preload.stateWithProducts('main.productList.pawnShop', {
          category: 'pawnShop'
        }, true, 'forward')
        .catch(U.error);
    }

    function preloadToMarketProductDetail(id) {
      return Preload.stateWithProducts('main.productDetail.market', {
          category: 'market',
          id: id
        }, true, 'forward')
        .catch(U.error);
    }

    function preloadToPawnShopProductDetail(id) {
      return Preload.stateWithProducts('main.productDetail.pawnShop', {
          category: 'pawnShop',
          id: id
        }, true, 'forward')
        .catch(U.error);
    }

    function refreshProducts() {
      var category;
      var currentModel;
      var distance;
      var query;
      if ($state.params.category === 'pawnShop') {
        query = {
          category: 'pawnShop',
          showBid: true,
          limit: 10,
          sort: 'id DESC',
          populates: ['photos']
        };
        if (ProductListModel.searchWord) {
          query.filter = ProductListModel.searchWord;
        }
        return Products.getProducts(query).$promise
          .then(function(productsWrapper) {
            ProductListModel.pawnShop.products = productsWrapper.products;
            ProductListModel.pawnShop.more = productsWrapper.more;
          })
          .catch(function(err) {
            return U.error(err);
          })
          .finally(function() {
            $scope.$broadcast('scroll.refreshComplete');
          });
      } else if ($state.params.category === 'market') {
        distance = appStorage.marketDistance;
        category = 'market';
        currentModel = ProductListModel.market;
        query = {
          category: category,
          longitude: appStorage.geoJSON.coordinates[0],
          latitude: appStorage.geoJSON.coordinates[1],
          distance: distance,
          limit: 10,
          populates: ['photos', 'place']
        };
        if (appStorage.address === '전체보기') {
          query.distance = 999999;
          query.sort = {
            '_id': -1
          };
        }
        if (ProductListModel.searchWord) {
          query.filter = ProductListModel.searchWord;
        }
        return Products.getProductsWithin(query).$promise
          .then(function(productsWrapper) {
            console.log(productsWrapper);
            if (productsWrapper && productsWrapper.products && productsWrapper.products.length === 0) {
              $scope.$broadcast('scroll.refreshComplete');
              return Message.alert('새로고침 알림', '주위 상품이 없습니다');
            }
            ProductListModel.market.products = productsWrapper.products;
            ProductListModel.market.more = productsWrapper.more;
            U.resize();
          })
          .catch(function(err) {
            console.log(err);
            return Message.alert();
          })
          .finally(function() {
            $scope.$broadcast('scroll.refreshComplete');
          });
      }
    }

    function getFurtherProducts() {
      var category;
      var currentModel;
      var distance;
      if ($state.params.category === 'pawnShop') {} else if ($state.params.category === 'market') {
        distance = appStorage.marketDistance;
        category = 'market';
        currentModel = ProductListModel.market;
        var query = {
          category: category,
          longitude: appStorage.geoJSON.coordinates[0],
          latitude: appStorage.geoJSON.coordinates[1],
          distance: distance,
          limit: 10,
          skip: currentModel.products.length,
          populates: ['photos', 'place']
        };
        if (ProductListModel.searchWord) {
          query.filter = ProductListModel.searchWord;
        }
        return Products.getProductsWithin(query).$promise
          .then(function(productsWrapper) {
            angular.forEach(productsWrapper.products, function(product) {
              currentModel.products.push(product);
            });
            currentModel.more = productsWrapper.more;
            return U.resize();
          })
          .catch(function(err) {
            console.log(err);
            currentModel.more = false;
            return Message.alert();
          })
          .finally(function() {
            $scope.$broadcast('scroll.infiniteScrollComplete');
          });
      }
    }

    function getOlderPawnShopProducts() {
      var lastId = ProductListModel.pawnShop.products[ProductListModel.pawnShop.products.length - 1].id;
      var query = {
        olderThan: lastId,
        category: 'pawnShop',
        showBid: true,
        limit: 10,
        populates: ['photos']
      };
      if (ProductListModel.searchWord) {
        query.filter = ProductListModel.searchWord;
      }
      return Products.getProducts(query).$promise
        .then(function(productsWrapper) {
          console.log(productsWrapper.products);
          angular.forEach(productsWrapper.products, function(product) {
            ProductListModel.pawnShop.products.push(product);
          });
          ProductListModel.pawnShop.more = productsWrapper.more;
        })
        .catch(function(err) {
          return U.error(err);
        })
        .finally(function() {
          return U.resize();
        });
    }

    //====================================================
    //  PlaceID
    //====================================================
    function getNewerProducts() {
      Products.getProducts({
        newerThan: ProductListModel.placeId.products[0].id,
        place: ProductListModel.placeId.products[0].place.id,
        category: 'market',
        limit: 10,
        populates: ['photos']
      }).$promise
        .then(function(productsWrapper) {
          console.log(productsWrapper);
          if (productsWrapper.products && productsWrapper.products.length === 0) {
            return Message.alert('새로고침 알림', '주위 상품이 없습니다');
          }
          angular.forEach(productsWrapper.products, function(product) {
            ProductListModel.placeId.products.unshift(product);
          });
          U.resize();
        })
        .catch(function(err) {
          console.log(err);
          return Message.alert();
        })
        .finally(function() {
          $scope.$broadcast('scroll.refreshComplete');
        });
    }

    function getOlderProducts() {
      var last = ProductListModel.placeId.products.length - 1;
      Products.getProducts({
        olderThan: ProductListModel.placeId.products[last].id,
        place: ProductListModel.placeId.products[0].place.id,
        category: 'market',
        sort: 'id DESC',
        limit: 10,
        populates: ['photos']
      }).$promise
        .then(function(productsWrapper) {
          console.log(productsWrapper);
          angular.forEach(productsWrapper.products, function(product) {
            ProductListModel.placeId.products.push(product);
          });
          ProductListModel.placeId.more = productsWrapper.more;
          U.resize();
        })
        .catch(function(err) {
          U.error(err);
        })
        .finally(function() {
          $scope.$broadcast('scroll.infiniteScrollComplete');
        });
    }
    //====================================================
    //  View state
    //====================================================
    function onBeforeEnter() {
      U.resize();
    }

    function onAfterEnter() {
      ProductList.showPhotos = true;
    }

    function onAfterLeave() {
      ProductList.showPhotos = false;
    }
    //====================================================
    //  Helper
    //====================================================



    //====================================================
    //  App specific
    //====================================================
    function goToRegisterHandler() {
      ProductList.beforeRegisterModal.hide();
      $timeout(function() {
        $state.go('main.productRegister.step1', {
          category: 'user',
          step: 1,
          method: 'create'
        });
      }, 100);
    }

    //====================================================
    //  Modal
    //====================================================
    $ionicModal.fromTemplateUrl('state/10productList/modal/beforeRegisterModal.html', {
      scope: $scope,
      animation: 'mh-slide'
    }).then(function(modal) {
      ProductList.beforeRegisterModal = modal;
    });

  } //end
})();
