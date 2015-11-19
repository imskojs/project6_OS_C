(function() {
  'use strict';

  angular.module('app')
    .factory('LoginModel', LoginModel);

  LoginModel.$inject = [];

  function LoginModel() {

    var model = {
      form: {
        username: null,
        email: null,
        password: null
      }
    };
    return model;

  }
})();
