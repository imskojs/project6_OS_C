(function() {
  'use strict';

  angular.module('app')
    .factory('MainModel', MainModel);

  MainModel.$inject = [];

  function MainModel() {

    var model = {};

    return model;
  }
})();
