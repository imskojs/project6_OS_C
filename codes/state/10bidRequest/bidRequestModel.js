(function() {
  'use strict';

  angular.module('app')
    .factory('BidRequestModel', BidRequestModel);

  BidRequestModel.$inject = [];

  function BidRequestModel() {

    var model = {
      form: {

      }
    };
    return model;
  }
})();
