(function() {
  'use strict';
  angular.module('app')
    .controller('ProductUpdatePhotoController', ProductUpdatePhotoController);

  ProductUpdatePhotoController.$inject = ['ProductUpdateModel', 'Message', 'U', '$scope', '$filter'];

  function ProductUpdatePhotoController(ProductUpdateModel, Message, U, $scope, $filter) {

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
      var alert = Message.alert.bind(null,
        $filter('translate')('PHOTO_REGISTER_ALERT'));
      if (length !== 1 && !ProductUpdateModel.dataUris[length - 2]) {
        if (length === 2) {
          alert(
            $filter('translate')('REGISTER_FRONT_PHOTO')
          );
          return false;
        } else if (length === 3) {
          alert(
            $filter('translate')('REGISTER_SIDE_PHOTO')
          );
          return false;
        } else if (length === 4) {
          alert(
            $filter('translate')('REGISTER_TAG_PHOTO')
          );
          return false;
        } else if (length === 5) {
          alert(
            $filter('translate')('REGISTER_ALL_PARTS_PHOTO')
          );
          return false;
        }
      }
      return true;
    }

  } //end
})();
