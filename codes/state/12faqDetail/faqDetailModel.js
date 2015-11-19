(function() {
  'use strict';

  angular.module('app')
    .factory('FaqDetailModel', FaqDetailModel);

  FaqDetailModel.$inject = [];

  function FaqDetailModel() {

    var model = {
      post: {
        title: 'test',
        content: 'test test',
        createdAt: null,
      }
    };
    return model;
  }
})();
