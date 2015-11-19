(function() {
  'use strict';

  angular.module('app')
    .factory('BidRespondModel', BidRespondModel);

  BidRespondModel.$inject = [];

  function BidRespondModel() {

    var model = {
      bid: {
        id: 'asdf',
        createdAt: '2015.08.20',
        createdBy: {
          nickname: '닉네임'
        },
        place: {
          name: '착한전당포'
        },
        product: {
          photos: [{
            url: 'http://placehold.it/500x400'
          }, {
            url: 'http://placehold.it/500x400'
          }],
          name: '아이패등',
          brand: '애플',
          boughtAt: '2015.11.11',
          condition: '상',
        }
      },
      form: {
        price: null,
        monthlyInterest: null,
        duration: null,
        canPickUp: null
      }
    };
    return model;
  }
})();
