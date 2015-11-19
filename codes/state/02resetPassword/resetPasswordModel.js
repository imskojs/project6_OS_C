(function() {
  'use strict';

  angular.module('app')
    .factory('ResetPasswordModel', ResetPasswordModel);

  ResetPasswordModel.$inject = [];

  function ResetPasswordModel() {

    var model = {
      form: {
        oldPassword: null,
        newPassword: null
      },
      confirmPassword: null

    };
    return model;
  }
})();
