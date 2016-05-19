(function() {
  'use strict';

  angular.module('app')
    .factory('ProductRegisterModel', ProductRegisterModel);

  ProductRegisterModel.$inject = ['U', 'Message', '$state', '$filter'];

  function ProductRegisterModel(U, Message, $state, $filter) {

    var model = {
      // product properties
      dataUris: [null, null, null, null, null],
      fileUris: [null, null, null, null, null],
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
        this.form.showBid = true;
        this.product.photos = [];
        this.dataUris = [null, null, null, null, null];
        this.fileUris = [null, null, null, null, null];
      },
      validate: function() {
        var alert = Message.alert.bind(null, $filter('translate')('REGISTER_PRODUCT_ALERT'));
        var form = this.form;
        if ($state.params.category === 'user') {
          if (!form.name) {
            alert($filter('translate')('INPUT_PRODUCT_NAME'));
            return false;
          } else if (!form.productCategory) {
            alert($filter('translate')('INPUT_PRODUCT_CATEGORY'));
            return false;
          } else if (!form.brand) {
            alert($filter('translate')('INPUT_BRAND'));
            return false;
          } else if (!form.boughtAt) {
            alert($filter('translate')('INPUT_BOUGHTAT'));
            return false;
          } else if (!form.condition) {
            alert($filter('translate')('INPUT_CONDITION'));
            return false;
          } else if (typeof form.showBid !== 'boolean') {
            alert($filter('translate')('INPUT_SHOW_BID'));
            return false;
          } else if (!form.description) {
            alert($filter('translate')('INPUT_EXTRA_ORDINARY'));
            return false;
          } else {
            return true;
          }
        } else if ($state.params.category === 'pawnShop') {
          if (!form.name) {
            alert($filter('translate')('INPUT_PRODUCT_NAME'));
            return false;
          } else if (!form.productCategory) {
            alert($filter('translate')('INPUT_PRODUCT_CATEGORY'));
            return false;
          } else if (!form.brand) {
            alert($filter('translate')('INPUT_BRAND'));
            return false;
          } else if (!form.boughtAt) {
            alert($filter('translate')('INPUT_BOUGHTAT'));
            return false;
          } else if (!form.condition) {
            alert($filter('translate')('INPUT_CONDITION'));
            return false;
          } else if (!form.description) {
            alert($filter('translate')('INPUT_EXTRA_ORDINARY'));
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
