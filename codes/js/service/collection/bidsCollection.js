(function() {
  'use strict';

  angular.module('app')
    .factory('Bids', Bids);

  Bids.$inject = ['$resource', 'governorUrl'];

  function Bids($resource, governorUrl) {

    var bidUrl = governorUrl + '/bid' +
      '/:findOne' +
      '/:find' +
      '/:create' +
      '/:update' +
      '/:destroy' +
      '/:findOrCreate' +
      '/:count';

    var params = {
      findOne: '@findOne',
      find: '@find',
      create: '@create',
      update: '@update',
      destroy: '@destroy',
      findOrCreate: '@findOrCreate',
      count: '@count'
    };

    var actions = {
      findOne: {
        method: 'GET',
        params: {
          findOne: 'findOne'
        }
      },
      find: {
        method: 'GET',
        params: {
          find: 'find'
        }
      },
      create: {
        method: 'POST',
        params: {
          create: 'create'
        }
      },
      update: {
        method: 'PUT',
        params: {
          update: 'update'
        }
      },
      destroy: {
        method: 'DELETE',
        params: {
          destroy: 'destroy'
        }
      },
      findOrCreate: {
        method: 'POST',
        params: {
          findOrCreate: 'findOrCreate'
        }
      },
      count: {
        method: 'GET',
        params: {
          count: 'count'
        }
      },
    };

    var service = $resource(bidUrl, params, actions);

    return service;
  }

})();
