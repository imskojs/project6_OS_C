(function() {
  'use strict';

  angular.module('app')
    .factory('ProfileModel', ProfileModel);

  ProfileModel.$inject = [];

  function ProfileModel() {

    var model = {
      fileUris: [],
      dataUris: [],
      place: {
        photos: [],
        name: '착한 전당포',
        email: 'niceshop@shop.co.kr',
        password: '',
        confirmPassword: '',
        cellPhone: 1012341234,
        phone: 212345678,
        companyNumber: '2013-서울강남-0123',
        address: '서울특별시 서초구 신반포로 177 6층 203호',
        openingHours: '일요일: 5시 평일 9시',
        description: '컴퓨터(아이맥/레노버/삼성/엘지)등\n패드(갤럭시 노트패드 / 아이패드)등\n여러물품 취급합니다.'
      },
      user: {}
    };
    return model;
  }
})();
