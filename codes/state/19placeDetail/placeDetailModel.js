(function() {
  'use strict';

  angular.module('app')
    .factory('PlaceDetailModel', PlaceDetailModel);

  PlaceDetailModel.$inject = [];

  function PlaceDetailModel() {

    var model = {
      place: {
        name: '착한 전당포',
        photos: [],

        address: '서울특별시 강남구 역삼동 123123123 123123 123123',
        cellPhone: '01012341234',
        phone: '021231231',
        openingHours: [{
          start: '07:00',
          end: '20:00'
        }, {
          start: '07:00',
          end: '20:00'
        }, {
          start: '07:00',
          end: '20:00'
        }, {
          start: '03:00',
          end: '20:00'
        }, ],
        canPickUp: true,
        showPhone: true,
        description: '전자제품 취급합니다. \n 컴퓨터 / 패드 / 핸드폰 등 여러 전자제품 취급합니다.'

      }
    };
    return model;
  }
})();
