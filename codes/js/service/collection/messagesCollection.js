(function() {
  'use strict';

  angular.module('app')
    .factory('Messages', Messages);

  Messages.$inject = ['$resource', 'governorUrl'];

  function Messages($resource, governorUrl) {

    var likesUrl = governorUrl + '/message' + '/:sender' + '/:list';

    var params = {
      sender: '@sender',
      list: '@list',
    };
    var actions = {
      getMyInboxSenderList: {
        method: 'GET',
        params: {
          sender: 'sender',
          list: 'list'
        }
      },

      readMessagesFrom: {
        method: 'GET'
      },

      sendMessage: {
        method: 'POST'
      }
    };

    var service = $resource(likesUrl, params, actions);

    return service;
  }

})();
