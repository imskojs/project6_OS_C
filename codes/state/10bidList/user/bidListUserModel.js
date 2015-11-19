(function() {
  'use strict';

  angular.module('app')
    .factory('BidListUserModel', BidListUserModel);

  BidListUserModel.$inject = [];

  function BidListUserModel() {

    var model = {
      bids: []
    };
    return model;
  }
})();
