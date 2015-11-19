(function() {
  'use strict';
  angular.module('app')
    .factory('Products', Products);

  Products.$inject = ['$resource', 'governorUrl'];

  function Products($resource, governorUrl) {

    var productUrl = governorUrl + '/product' + '/:list' +
      '/:image' + '/:mine' + '/:checkProductCode' + '/:ids' + '/:comments' + '/:within' + '/:like' + '/:unlike' + '/:setSoldOut' + '/:unsetSoldOut' + '/:find' + '/:getProductsWithin' + '/:getProduct' + '/:getProducts' + '/:destroy';

    var params = {
      list: '@list',
      image: '@image',
      mine: '@mine',
      checkProductCode: '@checkProductCode',
      ids: '@ids',
      comments: '@comments',
      within: '@within',
      like: '@like',
      unlike: '@unlike',
      setSoldOut: '@setSoldOut',
      unsetSoldOut: '@unsetSoldOut',
      find: '@find',

      getProductsWithin: '@getProductsWithin',
      getProduct: '@getProduct',
      getProducts: '@getProducts',
      destroy: '@destroy'
    };

    var actions = {

      destroy: {
        method: 'DELETE',
        params: {
          destroy: 'destroy'
        }
      },
      getProductsWithin: {
        method: 'GET',
        params: {
          getProductsWithin: 'getProductsWithin'
        }
      },

      getProduct: {
        method: 'GET',
        params: {
          getProduct: 'getProduct'
        }
      },

      getProducts: {
        method: 'GET',
        params: {
          getProducts: 'getProducts'
        }
      },





      find: {
        method: 'GET',
        params: {
          find: 'find'
        }
      },
      setSoldOut: {
        method: 'PUT',
        params: {
          setSoldOut: 'setSoldOut'
        }
      },

      unsetSoldOut: {
        method: 'PUT',
        params: {
          unsetSoldOut: 'unsetSoldOut'
        }
      },

      unlike: {
        method: 'PUT',
        params: {
          unlike: 'unlike'
        }
      },

      like: {
        method: 'PUT',
        params: {
          like: 'like'
        }
      },

      getProductWithin: { // longitude, latitude, distance
        method: 'GET',
        params: {
          list: 'list',
          within: 'within'
        }
      },

      getProductsWithComments: {
        method: 'GET',
        params: {
          comments: 'comments'
        },
        isArray: true
      },
      getProductsWithIds: {
        method: 'GET',
        params: {
          ids: 'ids'
        },
        isArray: true
      },
      getMyProducts: {
        method: 'GET',
        params: {
          list: 'list',
          mine: 'mine'
        }
      },
      checkProductCode: {
        method: 'GET',
        params: {
          checkProductCode: 'checkProductCode'
        }
      },
      findById: {
        method: 'GET'
      },
      createProduct: {
        method: 'POST'
      },
      updateProduct: {
        method: 'PUT',
        isArray: true
      },
      removeProduct: {
        method: 'DELETE'
      },
      removeProducts: {
        method: 'DELETE',
        isArray: true
      }
    };

    var service = $resource(productUrl, params, actions);

    return service;

  } //end
})();





// /* Set the default values for ngf-select and ngf-drop directives*/
// Upload.setDefaults({
//   ngfMinSize: 20000,
//   ngfMaxSize: 20000000,
// });

// /* Convert the file to base64 data url*/
// Upload.dataUrl(file, disallowObjectUrl).then(function(url) {});

// /* Get image file dimensions*/
// Upload.imageDimensions(file).then(function(dimensions) {
//   console.log(dimensions.width, dimensions.height);
// });

// /* Get audio/video duration*/
// Upload.mediaDuration(file).then(function(durationInSeconds) {

// });

// /* returns boolean showing if image resize is supported by this browser*/
// Upload.isResizeSupported();
// /* returns boolean showing if resumable upload is supported by this browser*/
// Upload.isResumeSupported();
