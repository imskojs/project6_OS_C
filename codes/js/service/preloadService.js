//====================================================
// createdBy;
// Seunghoon Ko (imskojs@gmail.com)
// Gush... I'm not goint to use preload... just look at those injected Models!!!
//====================================================
(function() {
  'use strict';

  angular.module('app')
    .factory('Preload', Preload);

  Preload.$inject = [
    'Products', 'Places', 'Bids', 'BidListPawnShopPendingModel', 'ProductUpdateModel',
    'BidDetailPawnShopPendingModel', 'BidListPawnShopRespondedModel',
    'ProductListModel', 'ProductDetailModel', 'PlaceDetailModel', 'BidDetailUserModel',
    'BidDetailPawnShopRespondedModel', 'FavoriteProductListModel', 'FavoriteProductDetailModel',
    'MyProductListUserModel', 'BidListUserModel', 'MyProductListPawnShopModel',
    'U', '$q', '$filter', '_', 'Message', 'appStorage', '$timeout', '$state'
  ];

  function Preload(
    Products, Places, Bids, BidListPawnShopPendingModel, ProductUpdateModel,
    BidDetailPawnShopPendingModel, BidListPawnShopRespondedModel,
    ProductListModel, ProductDetailModel, PlaceDetailModel, BidDetailUserModel,
    BidDetailPawnShopRespondedModel, FavoriteProductListModel, FavoriteProductDetailModel,
    MyProductListUserModel, BidListUserModel, MyProductListPawnShopModel,
    U, $q, $filter, _, Message, appStorage, $timeout, $state
  ) {

    var service = {
      photos: photos,
      stateWithProducts: stateWithProducts,
      stateWithPlaces: stateWithPlaces,
      stateWithBids: stateWithBids
    };

    return service;

    //====================================================
    //  Implementation
    //====================================================
    function photos(arrayOfObjsWithPhotosArray, cloudinaryFilterName, onlyFirstOnesBool) {
      var urls = getPhotos(arrayOfObjsWithPhotosArray, cloudinaryFilterName, onlyFirstOnesBool);
      var promises = [];
      angular.forEach(urls, function(url) {
        var deferred = $q.defer();
        var img = new Image();
        img.onload = onImageLoad(deferred);
        img.onerror = onImageError(deferred, url);
        promises.push(deferred.promise);
        img.src = url;
      });
      return $q.all(promises);
    }

    //====================================================
    //  Bids
    //====================================================
    function stateWithBids(state, params, moveToStateBool, navDirection) {
      Message.loading();
      console.log("---------- params.product ----------");
      console.log(params.product);
      console.log("HAS TYPE: " + typeof params.product);

      var promise;
      if (state === 'main.bidListUser') {
        promise = Bids.find({
            product: params.product,
            limit: 10,
            status: 'responded',
            sort: 'updatedAt DESC',
            populates: ['photos', 'owner', 'place', 'createdBy']
          }).$promise
          .then(function(bidsWrapper) {
            BidListUserModel.bids = bidsWrapper.bids;
            BidListUserModel.more = bidsWrapper.more;
            console.log(BidListUserModel.bids);
            return photos(BidListUserModel.bids, 'cloudinary200', true);
          });
        if (moveToStateBool) {
          promise.then(function() {
            U.goToState(state, params, navDirection);
          });
        }
        return promise;
      } else if (state === 'main.bidDetailUser') {
        promise = Bids.findOne({
            id: params.id,
            populates: ['photos', 'createdBy', 'owner']
          }).$promise
          .then(function(bid) {
            BidDetailUserModel.bid = bid;
            console.log("---------- BidDetailUserModel.bid ----------");
            console.log(BidDetailUserModel.bid);
            console.log("HAS TYPE: " + typeof BidDetailUserModel.bid);
            console.log("---------- CONSOLE END -------------------");

            return photos(BidDetailUserModel.bid, 'cloudinary400', false);
          });
        if (moveToStateBool) {
          promise.then(function() {
            U.goToState(state, params, navDirection);
          });
        }
        return promise;
      } else if (state === 'main.bidListPawnShopPending') {
        promise = Bids.find({
            owner: appStorage.place.owner,
            limit: 10,
            status: 'pending',
            sort: 'id DESC',
            populates: ['photos', 'createdBy']
          }).$promise
          .then(function(bidsWrapper) {
            $timeout(function() {
              BidListPawnShopPendingModel.bids = bidsWrapper.bids;
              BidListPawnShopPendingModel.more = bidsWrapper.more;
              console.log(BidListPawnShopPendingModel.bids);
            }, 0);
            return photos(BidListPawnShopPendingModel.bids, 'cloudinary200', true);
          });
        if (moveToStateBool) {
          promise.then(function() {
            U.goToState(state, params, navDirection);
          });
        }
        return promise;
      } else if (state === 'main.bidDetailPawnShopPending') {
        promise = Bids.findOne({
            id: params.id,
            populates: ['photos', 'createdBy']
          }).$promise
          .then(function(bid) {
            BidDetailPawnShopPendingModel.bid = bid;
            console.log(BidDetailPawnShopPendingModel.bid);
            return photos(BidDetailPawnShopPendingModel.bid, 'cloudinary400', false);
          });
        if (moveToStateBool) {
          promise.then(function() {
            U.goToState(state, params, navDirection);
          });
        }
        return promise;
      } else if (state === 'main.bidListPawnShopResponded') {
        promise = Bids.find({
            owner: appStorage.place.owner,
            limit: 10,
            status: 'responded',
            sort: 'id DESC',
            populates: ['photos', 'createdBy']
          }).$promise
          .then(function(bidsWrapper) {
            BidListPawnShopRespondedModel.bids = bidsWrapper.bids;
            BidListPawnShopRespondedModel.more = bidsWrapper.more;
            console.log(BidListPawnShopRespondedModel.bids);
            return photos(BidListPawnShopRespondedModel.bids, 'cloudinary200', true);
          });
        if (moveToStateBool) {
          promise.then(function() {
            U.goToState(state, params, navDirection);
          });
        }
        return promise;
      } else if (state === 'main.bidDetailPawnShopResponded') {
        promise = Bids.findOne({
            id: params.id,
            populates: ['photos', 'createdBy']
          }).$promise
          .then(function(bid) {
            BidDetailPawnShopRespondedModel.bid = bid;
            console.log(BidDetailPawnShopRespondedModel.bid);
            return photos(BidDetailPawnShopRespondedModel.bid, 'cloudinary400', false);
          });
        if (moveToStateBool) {
          promise.then(function() {
            U.goToState(state, params, navDirection);
          });
        }
        return promise;
      }
    } // stateWithBids Ends


    //====================================================
    //  Places
    //====================================================
    function stateWithPlaces(state, params, moveToStateBool, navDirection) {
      Message.loading();
      var promise;
      if (state === 'main.placeDetail') {
        promise = Places.getPlace({
            id: params.id,
            populates: ['photos']
          }).$promise
          .then(function(place) {
            PlaceDetailModel.place = place;
            console.log(PlaceDetailModel.place);
            return photos(PlaceDetailModel.place, 'cloudinary400', false);
          });
        if (moveToStateBool) {
          promise.then(function() {
            U.goToState(state, params, navDirection);
          });
        }
        return promise;
      }
    } // stateWithPlaces end

    //====================================================
    //  Products
    //====================================================
    function stateWithProducts(state, params, moveToStateBool, navDirection) {
      Message.loading();
      var query;
      var onData;
      var promise;
      //====================================================
      //  productList.market
      //====================================================
      if (state === 'main.productList.market') {
        query = {
          category: params.category,
          longitude: appStorage.geoJSON.coordinates[0],
          latitude: appStorage.geoJSON.coordinates[1],
          distance: appStorage.marketDistance,
          status: 'selling',
          limit: 10,
          populates: ['photos', 'place']
        };
        console.log("---------- query ----------");
        console.log(query);
        console.log("HAS TYPE: " + typeof query);

        if (appStorage.address === 'SEEALL') {
          console.log('SEEALL');
          query.sort = {
            '_id': -1
          };
          query.distance = 999999;
        }
        onData = function(productsWrapper) {
          ProductListModel.market.products = productsWrapper.products;
          ProductListModel.market.more = productsWrapper.more;
          return photos(ProductListModel.market.products, 'cloudinary200', true);
        };
        promise = Products.getProductsWithin(query).$promise
          .then(onData);
        if (moveToStateBool) {
          promise.then(function() {
            U.goToState(state, params, navDirection);
          });
        }
        return promise;
        //====================================================
        // productList.pawnShop
        //====================================================
      } else if (state === 'main.productList.pawnShop') {
        query = {
          category: params.category,
          showBid: true,
          limit: 10,
          sort: 'id DESC',
          populates: ['photos']
        };
        onData = function(productsWrapper) {
          ProductListModel.pawnShop.products = productsWrapper.products;
          ProductListModel.pawnShop.more = productsWrapper.more;
          console.log(ProductListModel.pawnShop.products);
          return photos(ProductListModel.pawnShop.products, 'cloudinary200', true);
        };
        promise = Products.getProducts(query).$promise
          .then(onData);
        if (moveToStateBool) {
          promise.then(function() {
            U.goToState(state, params, navDirection);
          });
        }
        return promise;
        //====================================================
        // productList.placeId ==> main.placeId for nav reasons
        //====================================================
      } else if (state === 'main.placeId') {
        query = {
          place: params.id,
          category: params.category,
          limit: 10,
          sort: 'id DESC',
          populates: ['photos']
        };
        onData = function(productsWrapper) {
          ProductListModel.placeId.products = productsWrapper.products;
          ProductListModel.placeId.more = productsWrapper.more;
          return photos(ProductListModel.placeId.products, 'cloudinary200', true);
        };
        promise = Products.getProducts(query).$promise
          .then(onData);
        if (moveToStateBool) {
          promise.then(function() {
            U.goToState(state, params, navDirection);
          });
        }
        return promise;
        //====================================================
        //  productDetail.market
        //====================================================
      } else if (state === 'main.productDetail.market') {
        if (appStorage.user.lookAround) {
          Message.hide();
          return Message.alert(
              '둘러보기 알림.',
              '로그인을 하셔야 보실수있는 내용입니다.'
            )
            .then(function() {
              $state.go('main.login');
            });

        }
        query = {
          id: params.id,
          populates: ['photos', 'place']
        };
        onData = function(product) {
          ProductDetailModel.market.product = product;
          console.log("---------- product ----------");
          console.log(product);
          console.log("HAS TYPE: " + typeof product);

          console.log(ProductDetailModel.market.product);
          return photos(ProductDetailModel.market.product, 'cloudinary600', false);
        };
        promise = Products.getProduct(query).$promise
          .then(onData);
        if (moveToStateBool) {
          promise.then(function() {
            U.goToState(state, params, navDirection);
          });
        }
        return promise;
      } else if (state === 'main.productDetail.pawnShop') {
        if (appStorage.user.lookAround) {
          Message.hide();
          return Message.alert('둘러보기 알림.', '로그인을 하셔야 보실수있는 내용입니다.')
            .then(function() {
              $state.go('main.login');
            });
        }
        promise = Products.getProduct({
            id: params.id,
            populates: ['photos', 'place', 'createdBy']
          }).$promise
          .then(function(product) {
            ProductDetailModel.pawnShop.product = product;
            return photos(ProductDetailModel.pawnShop.product, 'cloudinary600', false);
          });
        if (moveToStateBool) {
          promise.then(function() {
            U.goToState(state, params, navDirection);
          });
        }
        return promise;
      } else if (state === 'main.myProductListUser') {
        promise = Products.getProducts({
            createdBy: appStorage.user.id,
            category: 'pawnShop',
            limit: 10,
            sort: 'id DESC',
            populates: ['photos']
          }).$promise
          .then(function(productsWrapper) {
            $timeout(function() {
              MyProductListUserModel.products = productsWrapper.products;
              MyProductListUserModel.more = productsWrapper.more;
            }, 0);
            return photos(MyProductListUserModel.products, 'cloudinary200', true);
          });
        if (moveToStateBool) {
          promise.then(function() {
            U.goToState(state, params, navDirection);
          });
        }
        return promise;
      } else if (state === 'main.myProductListPawnShop') {
        promise = Products.getProducts({
            createdBy: appStorage.user.id,
            category: 'market',
            limit: 10,
            sort: 'id DESC',
            populates: ['photos']
          }).$promise
          .then(function(productsWrapper) {
            MyProductListPawnShopModel.products = productsWrapper.products;
            MyProductListPawnShopModel.more = productsWrapper.more;
            return photos(MyProductListPawnShopModel.products, 'cloudinary200', true);
          });
        if (moveToStateBool) {
          promise.then(function() {
            U.goToState(state, params, navDirection);
          });
        }
        return promise;
      } else if (state === 'main.productUpdate.info') {
        promise = Products.getProduct({
            id: params.id,
            populates: ['photos']
          }).$promise
          .then(function(product) {
            product.price = Number(product.price);
            ProductUpdateModel.product = product;
            console.log(product);
            return photos(ProductUpdateModel.product, 'cloudinary400', false);
          });
        if (moveToStateBool) {
          promise.then(function() {
            U.goToState(state, params, navDirection);
          });
        }
        return promise;
      } else if (state === 'main.favoriteProductList') {
        var favoriteIds = appStorage.favorites;
        if (!favoriteIds || favoriteIds.length === 0) {
          favoriteIds = 'none';
        }
        promise = Products.getProducts({
            id: favoriteIds,
            limit: 10,
            sort: 'id DESC',
            populates: ['photos', 'place']
          }).$promise
          .then(function(productsWrapper) {
            FavoriteProductListModel.products = productsWrapper.products;
            FavoriteProductListModel.more = productsWrapper.more;
            return photos(FavoriteProductListModel.products, 'cloudinary200', true);
          });
        if (moveToStateBool) {
          promise.then(function() {
            U.goToState(state, params, navDirection);
          });
        }
        return promise;
      } else if (state === 'main.favoriteProductDetail') {
        promise = Products.getProduct({
            id: params.id,
            populates: ['photos', 'place', 'createdBy']
          }).$promise
          .then(function(product) {
            FavoriteProductDetailModel.product = product;
            return photos(FavoriteProductDetailModel.product, 'cloudinary400', false);
          });
        if (moveToStateBool) {
          promise.then(function() {
            U.goToState(state, params, navDirection);
          });
        }
        return promise;

      }

    } // stateWithProducts Ends

    //====================================================
    //  Helper
    //====================================================
    function onImageLoad(deferred) {
      return function() {
        deferred.resolve();
      };
    }

    function onImageError(deferred, url) {
      return function() {
        deferred.reject(url);
      };
    }

    function getPhotos(posts, cloudinaryFilterName, onlyFirstOnesBool) {
      var preProcessedUrls = [];
      if (!Array.isArray(posts)) {
        posts = [posts];
      }
      var arrayOfUrls = _.pluck(posts, 'photos');
      angular.forEach(arrayOfUrls, function(photos) {
        var urls = _.pluck(photos, 'url');
        if (onlyFirstOnesBool) {
          var first = urls[0];
          urls = [first];
        }
        preProcessedUrls = preProcessedUrls.concat(urls);
      });
      var urls = _.map(preProcessedUrls, function(url) {
        return $filter(cloudinaryFilterName)(url);
      });
      urls = _.filter(urls, function(url) {
        return url != null;
      });
      return urls;
    }

  } // Service END
})();
