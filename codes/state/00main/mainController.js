(function() {
  'use strict';
  angular.module('app')
    .controller('MainController', MainController);

  MainController.$inject = [
    'Products', 'MainModel', '$scope', 'appStorage', '$state',
    '$ionicSideMenuDelegate', '$ionicModal', '$stateParams',
    'Message', 'U', 'AppService', 'Preload', '$localStorage', 'appName'
  ];

  function MainController(
    Products, MainModel, $scope, appStorage, $state,
    $ionicSideMenuDelegate, $ionicModal, $stateParams,
    Message, U, AppService, Preload, $localStorage, appName
  ) {

    var Main = this;
    Main.Model = MainModel;

    Main.logout = logout;
    Main.getMyPawnShopProducts = getMyPawnShopProducts;
    Main.preloadToMyProductListUser = preloadToMyProductListUser;
    Main.preloadToMyProductListPawnShop = preloadToMyProductListPawnShop;
    Main.preloadToBidListPawnShopPending = preloadToBidListPawnShopPending;
    Main.preloadToBidListPawnShopResponded = preloadToBidListPawnShopResponded;
    Main.preloadToFavoriteProductList = preloadToFavoriteProductList;
    //====================================================
    //  Implementation
    //====================================================
    function logout(stateAfterLogout) {
      $localStorage[appName] = {
        geoJSON: {
          type: 'Point',
          coordinates: [127.02800027507125, 37.498085435791786] // default 강남역.
        },
        marketDistance: 8000,
        pawnShopDistance: 5000,
        address: '강남역',
        firstTime: false
      };
      $ionicSideMenuDelegate.toggleLeft(false);
      $state.go(stateAfterLogout);
    }

    function getMyPawnShopProducts() {
      return AppService.getMyPawnShopProducts()
        .then(function() {
          return U.goToState('main.myProductList', {
            category: 'pawnShop'
          });
        })
        .catch(U.error);
    }

    function preloadToMyProductListUser() {
      return Preload.stateWithProducts('main.myProductListUser', {
          category: 'user'
        }, true, 'forward')
        .catch(U.error);
    }

    function preloadToMyProductListPawnShop() {
      return Preload.stateWithProducts('main.myProductListPawnShop', {
          category: 'pawnShop'
        }, true, 'forward')
        .catch(U.error);
    }

    function preloadToBidListPawnShopPending() {
      return Preload.stateWithBids('main.bidListPawnShopPending', {
          category: 'pawnShop',
          status: 'pending'
        }, true, 'forward')
        .catch(U.error);
    }

    function preloadToBidListPawnShopResponded() {
      return Preload.stateWithBids('main.bidListPawnShopResponded', {
          category: 'pawnShop',
          status: 'responded'
        }, true, 'forward')
        .catch(U.error);
    }

    function preloadToFavoriteProductList() {
      return Preload.stateWithProducts('main.favoriteProductList', {

        }, true, 'forward')
        .catch(U.error);
    }
    //====================================================
    //  Modal
    //====================================================
    $ionicModal.fromTemplateUrl('state/modal/requestLogin.html', {
      scope: $scope,
      animation: 'mh-slide'
    }).then(function(modal) {
      Main.requestLoginModal = modal;
    });
  }
})();