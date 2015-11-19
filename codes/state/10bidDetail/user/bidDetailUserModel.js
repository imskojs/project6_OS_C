(function() {
  'use strict';

  angular.module('app')
    .factory('BidDetailUserModel', BidDetailUserModel);

  BidDetailUserModel.$inject = [];

  function BidDetailUserModel() {

    var model = {
      bid: {}
    };
    return model;
  }
})();
