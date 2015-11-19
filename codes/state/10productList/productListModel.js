(function() {
  'use strict';

  angular.module('app')
    .factory('ProductListModel', ProductListModel);

  ProductListModel.$inject = [];

  function ProductListModel() {

    var model = {
      market: {
        products: []
      },
      pawnShop: {
        products: []
      },
      placeId: {
        products: []
      },
      location: '',
      geoJSON: {
        type: 'Point',
        coordinates: [150, 30]
      },
      // advertisements
      advertisements: [{
        id: 0,
        photos: [{
          id: 'photo111',
          url: 'img/banner1.png'
        }],
        url: 'http://naver.com',
        viewable: true
      }, {
        id: 1,
        photos: [{
          id: 'photo111',
          url: 'img/banner2.png'
        }],
        url: 'http://google.com',
        viewable: true
      }, {
        id: 2,
        photos: [{
          id: 'photo111',
          url: 'img/banner3.png'
        }],
        url: 'http://google.com',
        viewable: true
      }],
      // products
      products: [],
      more: false
    };
    return model;
  }
})();
