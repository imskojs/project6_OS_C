(function() {
  'use strict';

  angular.module('app')
    .factory('Comments', Comments);

  Comments.$inject = ['$resource', 'governorUrl'];

  function Comments($resource, governorUrl) {

    var commentUrl = governorUrl + '/:post' + '/:comment' + '/:reply';

    var params = {
      post: '@post',
      comment: '@comment',
      reply: '@reply'
    };

    var actions = {
      addCommentToPost: {
        method: 'POST',
        params: {
          post: 'post',
          comment: 'comment'
        }
      },
      reply: {
        method: 'POST',
        params: {
          comment: 'comment',
          reply: 'reply'
        }
      },
      find: {
        method: 'GET',
        params: {
          comment: 'comment'
        },
        isArray: true
      }
    };

    var service = $resource(commentUrl, params, actions);

    return service;
  }

})();
