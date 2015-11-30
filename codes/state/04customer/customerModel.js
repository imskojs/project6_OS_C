(function() {
  'use strict';

  angular.module('app')
    .factory('CustomerModel', CustomerModel);

  CustomerModel.$inject = [];

  function CustomerModel() {

    var model = {
      form: {
        email: '',
        phone: '',
        title: '',
        content: ''
      }
    };
    return model;
  }
})();
