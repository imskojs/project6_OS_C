(function() {
  'use strict';
  angular.module('app')
    .controller('ProductUpdatePhotoController', ProductUpdatePhotoController);

  ProductUpdatePhotoController.$inject = ['ProductUpdateModel', 'Message', 'U', '$scope'];

  function ProductUpdatePhotoController(ProductUpdateModel, Message, U, $scope) {

    var ProductUpdatePhoto = this;
    ProductUpdatePhoto.Model = ProductUpdateModel;

    ProductUpdatePhoto.getImage = getImage;

    $scope.$on('$ionicView.beforeEnter', function() {
      U.resize();
    });
    //====================================================
    //  Implementation
    //====================================================
    function getImage(length, sourceType) {
      if (validateImage(length)) {
        ImageService.get({
          from: sourceType,
          fileUris: ProductUpdateModel.fileUris,
          dataUris: ProductUpdateModel.dataUris,
        });
      }
    }

    function validateImage(length) {
      var alert = Message.alert.bind(null, '사진등록 알림');
      if (length !== 1 && !ProductUpdateModel.dataUris[length - 2]) {
        if (length === 2) {
          alert('전면사진을 먼저 등록해주세요.');
          return false;
        } else if (length === 3) {
          alert('측면사진을 먼저 등록해주세요.');
          return false;
        } else if (length === 4) {
          alert('일련번호(태그)를 먼저 등록해주세요.');
          return false;
        } else if (length === 5) {
          alert('부속품 전체를 먼저 등록해주세요.');
          return false;
        }
      }
      return true;
    }

  } //end
})();
