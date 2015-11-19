(function() {
  'use strict';

  angular.module('app')
    .factory('Users', Users);


  Users.$inject = ['$resource', 'governorUrl'];

  function Users($resource, governorUrl) {

    var userUrl = governorUrl + '/:auth' + '/:register' + '/:user' +
      '/:findOne' + '/:update' + '/:changePassword' + '/:checkEmail' +
      // old stuff
      '/:local' + '/:checkNickname' + '/:list' + '/:role' + '/:myrole' + '/:updateWithImage' + '/:registerPlaceOwner';

    var params = {

      user: '@user',
      findOne: '@findOne',
      update: '@update',
      changePassword: '@changePassword',

      auth: '@auth',
      register: '@register',
      checkNickname: '@checkNickname',
      checkEmail: '@checkEmail',
      list: '@list',
      role: '@role',
      myrole: '@myrole',
      updateWithImage: '@updateWithImage',
      registerPlaceOwner: '@registerPlaceOwner'
    };

    var actions = {

      findOne: {
        method: 'GET',
        params: {
          user: 'user',
          findOne: 'findOne'
        }
      },

      update: {
        method: 'PUT',
        params: {
          user: 'user',
          update: 'update',
          role: undefined
        }
      },

      changePassword: {
        method: 'PUT',
        params: {
          auth: 'auth',
          local: 'changePassword'
        }
      },

      checkEmail: {
        method: 'GET',
        params: {
          user: 'user',
          checkEmail: 'checkEmail'
        }
      },

      // Old stuff
      getUsers: {
        method: 'GET',
        params: {
          user: 'user',
          list: 'list'
        }
      },
      register: {
        method: 'POST',
        params: {
          register: 'register',
          role: undefined
        }
      },
      registerPlaceOwner: {
        method: 'POST',
        params: {
          registerPlaceOwner: 'registerPlaceOwner',
          role: undefined
        }
      },
      checkNickname: {
        method: 'GET',
        params: {
          user: 'user',
          checkNickname: 'checkNickname'
        }
      },
      login: {
        method: 'POST',
        params: {
          auth: 'auth',
          local: 'local'
        }
      },
      getMyRole: {
        method: 'GET',
        params: {
          role: 'role',
          myrole: 'myrole'
        }
      },
      updateProfileWithImage: {
        method: 'PUT',
        params: {
          user: 'user',
          updateWithImage: 'updateWithImage'
        }
      },
      updateUser: {
        method: 'PUT',
        params: {
          user: 'user',
          update: 'update'
        },
        isArray: true
      }
    };

    var service = $resource(userUrl, params, actions);

    return service;
  }
})();
