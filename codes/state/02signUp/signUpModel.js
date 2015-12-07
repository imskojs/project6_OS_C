(function() {
  'use strict';

  angular.module('app')
    .factory('SignUpModel', SignUpModel);

  SignUpModel.$inject = [];

  function SignUpModel() {

    var model = {
      form: {
        nickname: null,
        email: null,
        username: null,
        password: null

      },
      confirmPassword: null,
      checkedEmail: false,
      termsAgreed: false
    };

    return model;
  }
})();
