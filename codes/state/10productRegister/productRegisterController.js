(function() {
  'use strict';
  angular.module('app')
    .controller('ProductRegisterController', ProductRegisterController);

  ProductRegisterController.$inject = [
    '$scope', '$stateParams', '$state', '$ionicModal', '$timeout', '$q',
    '$cordovaGeolocation', '$filter',
    'U', 'Products', 'ProductRegisterModel', 'Message', 'ImageService',
    'appStorage', 'Preload', 'DaumMapModel'
  ];

  function ProductRegisterController(
    $scope, $stateParams, $state, $ionicModal, $timeout, $q,
    $cordovaGeolocation, $filter,
    U, Products, ProductRegisterModel, Message, ImageService,
    appStorage, Preload, DaumMapModel
  ) {

    var ProductRegister = this;
    ProductRegister.Model = ProductRegisterModel;

    ProductRegister.setCurrentLocation = setCurrentLocation;
    ProductRegister.setStepOne = setStepOne;
    ProductRegister.changeLocation = changeLocation;
    ProductRegister.getImage = getImage;
    ProductRegister.sendForm = sendForm;

    //====================================================
    //  Implementation
    //====================================================

    function setCurrentLocation() {
      return $cordovaGeolocation.getCurrentPosition({
          maximumAge: 10000,
          timeout: 6000
        })
        .then(function success(position) {
          Message.hide();
          if (position.coords == null) {
            Message.alert(
              $filter('translate')('GPS_IS_OFF'),
              $filter('translate')('TURN_ON_GPS')
            );
            return false;
          }
          DaumMapModel.currentPosition = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          };
          appStorage.geoJSON.coordinates = [
            position.coords.longitude,
            position.coords.latitude
          ];
          ProductRegisterModel.locationSelected = true;
          ProductRegister.stepTwoModal.hide();
          Message.alert(
            $filter('translate')('CURRENT_LOCATION_ALERT'),
            $filter('translate')('CURRENT_LOCATION_SET')
          );
        })
        .catch(function error(err) {
          console.log(err);
          return Message.alert(
            $filter('translate')('GPS_IS_OFF'),
            $filter('translate')('TURN_ON_GPS')
          );
        });
    }

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

      console.log("---------- ProductRegisterModel.fileUris ----------");
      console.log(ProductRegisterModel.fileUris);
      console.log("HAS TYPE: " + typeof ProductRegisterModel.fileUris);

      console.log("---------- ProductRegisterModel.dataUris ----------");
      console.log(ProductRegisterModel.dataUris);
      console.log("HAS TYPE: " + typeof ProductRegisterModel.dataUris);


      // if (validateImage(length)) {
      ImageService.get({
        from: sourceType,
        fileUris: ProductRegisterModel.fileUris,
        dataUris: ProductRegisterModel.dataUris,
      }, length - 1);
      // }
    }

    // function validateImage(length) {
    //   var alert = Message.alert.bind(null, '사진등록 알림');
    //   if (length !== 1 && !ProductRegisterModel.dataUris[length - 2]) {
    //     if (length === 2) {
    //       alert('전면사진을 먼저 등록해주세요.');
    //       return false;
    //     } else if (length === 3) {
    //       alert('측면사진을 먼저 등록해주세요.');
    //       return false;
    //     } else if (length === 4) {
    //       alert('일련번호(태그)를 먼저 등록해주세요.');
    //       return false;
    //     } else if (length === 5) {
    //       alert('부속품 전체를 먼저 등록해주세요.');
    //       return false;
    //     }
    //   }
    //   return true;
    // }

    function validateStep2Form() {
      if (!ProductRegisterModel.dataUris[0]) {
        return false;
      }
      return true;
    }

    function sendForm() {
      if (!validateStep2Form()) {
        return Message.alert(
          $filter('translate')('REGISTER_PRODUCT_ALERT'),
          $filter('translate')('ONLY_1_PHOTO')
        );
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
            ProductRegisterModel.locationSelected = false;
            return Message.alert(
              $filter('translate')('REGISTERATION_COMPLETE'),
              $filter('translate')('CONFIRM_AT_MY_BIDS')
            );
          })
          .then(function(alertResponse) {
            console.log(alertResponse);
            ProductRegisterModel.reset();
            return U.goToState('main.myProductListUser', {
              category: 'user'
            });
          })
          .catch(function(err) {
            console.log(err);
            if (err.data.numberOfBidsSent === 0) {
              Message.hide();
              return Message.alert(
                  $filter('translate')('THERE_IS_NO_PAWNSHOP'),
                  $filter('translate')('RE_SELECT_PLACE')
                )
                .then(U.goToState.bind(null, 'main.daumMap'));
            }
            Message.hide();
            return Message.alert();
          });
        // Pawnshop
      } else if ($state.params.category === 'pawnShop') {
        Message.loading();
        ProductRegisterModel.form.category = 'market';
        ProductRegisterModel.form.showBid = null;
        ProductRegisterModel.form.status = 'selling';
        ProductRegisterModel.form.place = appStorage.place.id;
        ProductRegisterModel.form.geoJSON = appStorage.place.geoJSON;

        return ImageService.post({
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
            return Message.alert(
              $filter('translate')('REGISTER_PROUCT_COMPLETE'),
              $filter('translate')('MOVE_TO_MY_PRODUCT')
            );
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
