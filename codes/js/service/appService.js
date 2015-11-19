//====================================================
// createdBy;
// Seunghoon Ko (imskojs@gmail.com)
//====================================================
(function() {
  'use strict';

  angular.module('app')
    .factory('AppService', AppService);

  AppService.$inject = ['Products', 'ProductListModel', 'U', 'Message', 'appStorage'];

  function AppService(Products, ProductListModel, U, Message, appStorage) {

    var service = {
      //MyProductList
      getMyPawnShopProducts: getMyPawnShopProducts,
      getMarketProducts: getMarketProducts,
      getPawnShopProducts: getPawnShopProducts,
      productListFind: productListFind,
      preloadState: preloadState
    };

    return service;

    function preloadState(state, params) {
      Message.loading();
      var query;
      var onData;
      //====================================================
      //  마켓
      //====================================================
      if (state === 'main.productList.market') {
        query = {
          where: {
            category: 'market'
          },
          limit: 10,
          sort: 'id DESC',
          populates: ['photos', 'place']
        };
        onData = function(productsWrapper) {
          ProductListModel.market.products = productsWrapper.products;
          ProductListModel.market.more = productsWrapper.more;
          return U.preload(ProductListModel.market.products, 'cloudinary200', true);
        };
        //====================================================
        //  전당포
        //====================================================
      } else if (state === 'main.productList.pawnShop') {
        query = {
          where: {
            category: 'pawnShop'
          },
          limit: 10,
          sort: 'id DESC',
          populates: ['photos', 'place']
        };
        onData = function(productsWrapper) {
          ProductListModel.pawnShop.products = productsWrapper.products;
          ProductListModel.pawnShop.more = productsWrapper.more;
          return U.preload(ProductListModel.pawnShop.products, 'cloudinary200', true);
        };
      }

      return Products.find(query).$promise
        .then(onData);
    }

    function productListFind(category, model) {
      Message.loading();
      return Products.find({
          where: {
            category: category
          },
          limit: 10
        }).$promise
        .then(function(productsWrapper) {
          model.products = productsWrapper.products;
          model.more = productsWrapper.more;
          return U.preload(model.products, 'cloudinary200', true);
        });
    }

    function getMyPawnShopProducts() {
      Message.loading();
      return Products.find({
          where: {
            id: appStorage.user.id,
            category: 'market'
          },
          limit: 10,
          populates: ['photos', 'place']
        }).$promise
        .then(function(productsWrapper) {
          MyProductListModel.products = productsWrapper.products;
          MyProductListModel.more = productsWrapper.more;
          return U.preload(MyProductListModel.products, 'cloudinary200', true);
        });
    }

    // return Products.getProducts({
    //     category: 'market',
    //     limit: 10,
    //     sort: 'id DESC',
    //     populates: 'photos,place'
    //   }).$promise
    function getMarketProducts() {
      Message.loading();
      return Products.find({
          where: {
            category: 'market'
          },
          limit: 10,
          sort: 'id DESC',
          populates: ['photos', 'place']
        }).$promise
        .then(function(productsWrapper) {
          ProductListModel.market.products = productsWrapper.products;
          ProductListModel.market.more = productsWrapper.more;
          return U.preload(ProductListModel.products, 'cloudinary200', true);
        });
    }

    function getPawnShopProducts() {
      Message.loading();
      return Products.find({
          where: {
            category: 'pawnShop'
          },
          limit: 10,
          sort: 'id DESC',
          populates: ['photos', 'place']
        }).$promise
        .then(function(productsWrapper) {
          ProductListModel.pawnShop.products = productsWrapper.products;
          ProductListModel.pawnShop.more = productsWrapper.more;
          return U.preload(ProductListModel.products, 'cloudinary200', true);
        });
    }

  } // Service END
})();
