(function() {
  'use strict';

  angular.module('app')
    .factory('TermDetailModel', TermDetailModel);

  TermDetailModel.$inject = [];

  function TermDetailModel() {

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
