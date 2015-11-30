(function() {
  'use strict';
  angular.module('app')
    .controller('ProductRegisterController', ProductRegisterController);

  ProductRegisterController.$inject = [
    'U', '$scope', 'Products', 'ProductRegisterModel', 'Message', '$stateParams',
    '$state', '$ionicModal', '$timeout', 'ImageService', 'appStorage', 'Preload', '$q'
  ];

  function ProductRegisterController(
    U, $scope, Products, ProductRegisterModel, Message, $stateParams,
    $state, $ionicModal, $timeout, ImageService, appStorage, Preload, $q
  ) {

    var ProductRegister = this;
    ProductRegister.Model = ProductRegisterModel;

    ProductRegister.setStepOne = setStepOne;
    ProductRegister.changeLocation = changeLocation;
    ProductRegister.getImage = getImage;
    ProductRegister.sendForm = sendForm;

    //====================================================
    //  Implementation
    //====================================================
    function setStepOne() {
      console.log($state.params.category);
      if (!ProductRegisterModel.validate()) {
        return false;
      }
      console.log($state.params.category);
      ProductRegister.stepOneModal.hide();
      return $timeout(function() {
        return $state.go('main.productRegister.step2', {
          category: $state.params.category,
          step: 2,
          method: 'create'
        });
      }, 150);
    }

    function changeLocation() {
      ProductRegister.stepTwoModal.hide();
      return $timeout(function() {
        return $state.go('main.daumMap', {
          prev: 'main.productRegister.step2'
        });
      }, 150);
    }

    function getImage(length, sourceType) {
      if (validateImage(length)) {
        ImageService.get({
          from: sourceType,
          fileUris: ProductRegisterModel.fileUris,
          dataUris: ProductRegisterModel.dataUris,
        });
      }
    }

    function validateImage(length) {
      var alert = Message.alert.bind(null, '사진등록 알림');
      if (length !== 1 && !ProductRegisterModel.dataUris[length - 2]) {
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

    function validateStep2Form() {
      if (!ProductRegisterModel.dataUris[0]) {
        return false;
      }
      return true;
    }

    function sendForm() {
      if (!validateStep2Form()) {
        return Message.alert('상품등록 알림', '사진을 최소한 1개이상 등록해주셔야합니다.');
      }

      if ($state.params.category === 'user') {
        Message.loading();
        ProductRegister.stepTwoModal.hide();
        ProductRegisterModel.form.category = 'pawnShop';
        ProductRegisterModel.form.status = 'pending';
        ProductRegisterModel.form.geoJSON = appStorage.geoJSON;

        return ImageService.post({
            url: '/product/byUser',
            dataUris: ProductRegisterModel.dataUris,
            fields: ProductRegisterModel.form
          })
          .then(function(productDataWrapper) {
            console.log(productDataWrapper.data);
            if (productDataWrapper.data.numberOfBidsSent === 0) {
              return $q.reject(productDataWrapper);
            }
            return Preload.stateWithProducts('main.myProductListUser', {
              category: 'user'
            }, false);
          })
          .then(function(photos) {
            console.log(photos);
            Message.hide();
            return Message.alert('견적등록이 완료 되었습니다.', '등록된 견적은 내견적서에서 확인 하실수 있습니다.');
          })
          .then(function(alertResponse) {
            console.log(alertResponse);
            return U.goToState('main.myProductListUser', {
              category: 'user'
            });
          })
          .catch(function(err) {
            console.log(err);
            if (err.data.numberOfBidsSent === 0) {
              Message.hide();
              return Message.alert('주위에 전당포가 없습니다', '지역을 다시 설정해주십시요.')
                .then(U.goToState.bind(null, 'main.daumMap'));
            }
            Message.hide();
            return Message.alert();
          })
          .finally(function() {
            return ProductRegisterModel.reset();
          });
        // Pawnshop
      } else if ($state.params.category === 'pawnShop') {
        Message.loading();
        ProductRegisterModel.form.category = 'market';
        ProductRegisterModel.form.showBids = null;
        ProductRegisterModel.form.status = 'selling';
        ProductRegisterModel.form.place = appStorage.place.id;
        ProductRegisterModel.form.geoJSON = appStorage.place.geoJSON;

        ImageService.post({
          url: '/product',
          dataUris: ProductRegisterModel.dataUris,
          fields: ProductRegisterModel.form
        })
          .then(function(productData) {
            console.log(productData);
            return Preload.stateWithProducts('main.myProductListPawnShop', {
              category: 'pawnShop'
            }, false);
          })
          .then(function(photos) {
            console.log(photos);
            Message.hide();
            return Message.alert('상품이 성공적으로 등록되었습니다', '나의 상품목록으로 이동하겠습니다.');
          })
          .then(function(alertResponse) {
            console.log(alertResponse);
            return U.goToState('main.myProductListPawnShop', {
              category: 'pawnShop'
            });
          })
          .catch(function(err) {
            console.log(err);
            Message.hide();
            return Message.alert();
          })
          .finally(function() {
            return ProductRegisterModel.reset();
          });
      }
    }
    //====================================================
    //  Modal
    //====================================================
    $ionicModal.fromTemplateUrl('state/10productRegister/modal/stepOneModal.html', {
      scope: $scope,
      animation: 'mh-slide'
    }).then(function(modal) {
      ProductRegister.stepOneModal = modal;
    });

    $ionicModal.fromTemplateUrl('state/10productRegister/modal/stepTwoModal.html', {
      scope: $scope,
      animation: 'mh-slide'
    }).then(function(modal) {
      ProductRegister.stepTwoModal = modal;
    });

    $ionicModal.fromTemplateUrl('state/10productRegister/modal/completedModal.html', {
      scope: $scope,
      animation: 'mh-slide'
    }).then(function(modal) {
      ProductRegister.completedModal = modal;
    });
  } //end
})();
