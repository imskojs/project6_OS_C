(function() {
  'use strict';

  angular.module('app')
    .factory('ProductRegisterModel', ProductRegisterModel);

  ProductRegisterModel.$inject = ['U', 'Message', '$state'];

  function ProductRegisterModel(U, Message, $state) {

    var model = {
      // product properties
      dataUris: [],
      fileUris: [],
      form: {
        name: null,
        productCategory: null,
        brand: null,
        boughtAt: null,
        price: null,
        condition: null,
        showBid: true,
        description: null,
      },
      product: {
        photos: [],
        name: null,
        productCategory: null,
        brand: null,
        boughtAt: null,
        condition: null,
        showBid: true,
        description: null,
      },
      reset: function() {
        U.reset(this.form);
        U.reset(this.product);
        this.product.photos = [];
        this.dataUris = [];
        this.fileUris = [];
      },
      validate: function() {
        var alert = Message.alert.bind(null, '상품등록 알림');
        var form = this.form;
        if ($state.params.category === 'user') {
          if (!form.name) {
            alert('제품명을 입력해주세요.');
            return false;
          } else if (!form.productCategory) {
            alert('품목을 입력해주세요.');
            return false;
          } else if (!form.brand) {
            alert('브랜드를 일력해주세요.');
            return false;
          } else if (!form.boughtAt) {
            alert('구입시기를 입력해주세요.');
            return false;
          } else if (!form.condition) {
            alert('상태를 선택해 주세요.');
            return false;
          } else if (typeof form.showBid !== 'boolean') {
            alert('견적서 공개여부를 선택해주세요');
            return false;
          } else if (!form.description) {
            alert('특이사항을 입력해주세요.');
            return false;
          } else {
            return true;
          }
        } else if ($state.params.category === 'pawnShop') {
          if (!form.name) {
            alert('제품명을 입력해주세요.');
            return false;
          } else if (!form.productCategory) {
            alert('품목을 입력해주세요.');
            return false;
          } else if (!form.brand) {
            alert('브랜드를 일력해주세요.');
            return false;
          } else if (!form.boughtAt) {
            alert('구입시기를 입력해주세요.');
            return false;
          } else if (!form.condition) {
            alert('상태를 선택해 주세요.');
            return false;
          } else if (!form.description) {
            alert('특이사항을 입력해주세요.');
            return false;
          } else {
            return true;
          }
        }
      }
    };
    return model;
  }
})();
