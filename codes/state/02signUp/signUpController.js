(function() {
  'use strict';
  angular.module('app')
    .controller('SignUpController', SignUpController);

  SignUpController.$inject = [
    '$scope', 'Users', 'Places', 'SignUpModel', 'Message', 'U',
    '$state', 'daum', '$ionicScrollDelegate', 'appStorage', '$q',
    'Preload', 'Devices', '$filter'
  ];

  function SignUpController(
    $scope, Users, Places, SignUpModel, Message, U,
    $state, daum, $ionicScrollDelegate, appStorage, $q,
    Preload, Devices, $filter
  ) {

    var SignUp = this;
    SignUp.Model = SignUpModel;

    SignUp.signUp = signUp;
    SignUp.searchPlace = searchPlace;
    SignUp.selectPlace = selectPlace;
    SignUp.checkEmail = checkEmail;

    $scope.$on('$ionicView.beforeEnter', onBeforeEnter);
    //------------------------
    //  IMPLEMENTATIONS
    //------------------------
    function checkEmail() {
      Message.loading();
      return Users.checkEmail({
          email: SignUpModel.form.email
        }).$promise
        .then(function(data) {
          if (data.isAvailable) {
            SignUpModel.checkedEmail = true;
            Message.alert(
              $filter('translate')('DUPLICATE_PASSWORD'),
              $filter('translate')('AVAILABLE_EMAIL')
            );
          } else {
            SignUpModel.checkedEmail = false;
            Message.alert(
              $filter('translate')('DUPLICATE_PASSWORD'),
              $filter('translate')('NOT_AVAILABLE_EMAIL')
            );
          }
        })
        .catch(function(err) {
          console.log(err);
          SignUpModel.checkedEmail = false;
          Message.alert('비밀번호 중복확인 알림', '이메일을 입력해주세요.');
        })
        .finally(function() {
          Message.hide();
        });
    }

    function searchPlace() {
      if (!SignUpModel.form.address) {
        return false;
      }
      var ps = new daum.maps.services.Places();
      Message.loading();
      ps.keywordSearch(SignUpModel.form.address, function(status, data) {
        // if no search result, notify and exit.
        Message.hide();
        if (data.places[0] === undefined) {
          Message.alert(
            $filter('translate')('NO_PLACE_EXIST'),
            $filter('translate')('SEARCH_AGAIN')
          );
          return false;
        }
        SignUpModel.places = data.places;
        console.log(data.places);

      }, function(err) {
        console.log(err);
        Message.hide();
        Message.alert();
      });
    }

    function selectPlace(placeObj) {
      SignUpModel.form.address = placeObj.address;
      SignUpModel.form.geoJSON = {
        type: 'Point',
        coordinates: [Number(placeObj.longitude), Number(placeObj.latitude)]
      };
      SignUpModel.places = [];
      $ionicScrollDelegate.resize();
      console.log(SignUpModel.form.address);
      console.log(SignUpModel.form.geoJSON);
      console.log(typeof SignUpModel.form.geoJSON.coordinates[0]);
    }

    function signUp(category) {
      var promise;
      SignUpModel.form.username = SignUpModel.form.email;
      if (!validateForm(category)) {
        return false;
      }
      Message.loading();
      if (category === 'user') {
        SignUpModel.form.role = 'user';
        promise = Users.register({}, SignUpModel.form).$promise;
      } else if (category === 'pawnShop') {
        SignUpModel.form.role = 'pawnShop';
        promise = Users.registerPlaceOwner({}, SignUpModel.form).$promise;
      } else {
        return Message.alert('something is wrong', 'SignUp.signUp');
      }
      return promise
        .then(function(userData) {
          console.log(userData);
          Message.hide();
          return Message.alert(
            $filter('translate')('USER_REGISTERATION_COMPLETE'),
            $filter('translate')('USER_REGISTERATION_COMPLETE')
          );
        })
        .then(function(alertResponse) {
          console.log(alertResponse);
          return login(SignUpModel.form.email, SignUpModel.form.password);
        })
        .catch(function(err) {
          console.log(err);
          Message.hide();
          reset();
          return Message.alert(
            $filter('translate')('SIGNUP_FAILED'),
            $filter('translate')('REINPUT')
          );
        });
    }

    function onBeforeEnter() {
      reset();
    }

    //====================================================
    //  Helper
    //====================================================
    function login(identifier, password) {
      Message.loading();
      return Users.login({}, {
          identifier: identifier,
          password: password
        }).$promise
        .then(function saveUserDataToStorage(authData) {
          appStorage.token = authData.token;
          appStorage.user = authData.user;
          return appStorage.user;
        })
        .then(function checkPlaceWith(userData) {
          return Places.getPlaces({
            owner: userData.id
          }).$promise;
        })
        .then(function createPlaceIfNoPlaces(placesWrapper) {
          if (placesWrapper.places.length === 0 && appStorage.user.role === 'pawnShop') {
            var placeData = getPlaceDataFromUser(appStorage.user);
            console.log('placeData');
            console.log(placeData);
            return $q.all([Places.createPlace({}, placeData).$promise]);
          } else {
            return placesWrapper.places;
          }
        })
        .then(function savePlaceDataToStorageThenMove(places) {
          console.log(places);
          appStorage.place = places[0] || [];
          var params = {};
          if (appStorage.user.role === 'user') {
            params.category = 'market';
          } else if (appStorage.user.role === 'pawnShop') {
            params.category = 'pawnShop';
          }
          return Preload.stateWithProducts('main.productList' + '.' + params.category,
            params, false);
        })
        .then(function() {
          return Devices.update(null, {
            deviceId: appStorage.deviceId || 'nil',
            user: appStorage.user.id
          });
        })
        .then(function() {
          appStorage.deviceUpdateDone = true;
        })
        .then(function() {
          var params = {};
          if (appStorage.user.role === 'user') {
            params.category = 'market';
          } else if (appStorage.user.role === 'pawnShop') {
            params.category = 'pawnShop';
          }
          return U.goToState('main.productList.' + params.category, params, 'forward');
        });
    }

    function getPlaceDataFromUser(user) {
      var place = {};
      angular.extend(place, user);
      delete place.id;
      delete place.createdAt;
      delete place.exp;
      delete place.gravatarUrl;
      delete place.iat;
      delete place.role;
      delete place.rol;
      delete place.updatedAt;
      delete place.username;
      place.description = '업데이트 해주세요.';
      place.category = 'pawnShop';
      return place;
    }


    function validateForm(category) {
      var alert = Message.alert.bind(null, '가입신청 알림');
      var form = SignUpModel.form;
      if (category === 'user') {
        if (!form.nickname) {
          alert($filter('translate')('INPUT_NICKNAME'));
          return false;
        } else if (form.nickname.length < 4) {
          alert($filter('translate')('NICKNAME_4_REQUIRED'));
          return false;
        } else if (!form.email) {
          alert($filter('translate')('INPUT_EMAIL'));
          return false;
        } else if (!SignUpModel.checkedEmail) {
          alert($filter('translate')('CHECK_DUPLICATE_EMAIL'));
          return false;
        } else if (!form.password) {
          alert($filter('translate')('INPUT_PASSWORD'));
          return false;
        } else if (form.password !== SignUpModel.confirmPassword) {
          alert($filter('translate')('REINPUT_PASSWORD'));
          return false;
        } else if (!SignUpModel.termsAgreed) {
          alert($filter('translate')('AGREE_TERMS'));
          return false;
        } else {
          return true;
        }
      } else if (category === 'pawnShop') {
        if (!form.name) {
          alert($filter('translate')('INPUT_PAWNSHOPNAME'));
          return false;
        } else if (!form.email) {
          alert($filter('translate')('INPUT_EMAIL'));
          return false;
        } else if (!SignUpModel.checkedEmail) {
          alert($filter('translate')('CHECK_DUPLICATE_EMAIL'));
          return false;
        } else if (!form.password) {
          alert($filter('translate')('INPUT_PASSWORD'));
          return false;
        } else if (form.password !== SignUpModel.confirmPassword) {
          alert($filter('translate')('REINPUT_PASSWORD'));
          return false;
        } else if (!form.cellPhone) {
          alert($filter('translate')('INPUT_PHONE'));
          return false;
        } else if (!form.phone) {
          alert($filter('translate')('INPUT_PHONE'));
          return false;
        } else if (!form.companyNumber) {
          alert($filter('translate')('INPUT_COMPANY_NUMBER'));
          return false;
        } else if (!form.address) {
          alert($filter('translate')('INPUT_ADDRESS'));
          return false;
        } else if (!form.geoJSON) {
          alert($filter('translate')('CHOOSE_ADDRESS'));
          return false;
        } else if (!SignUpModel.termsAgreed) {
          alert($filter('translate')('AGREE_TERMS'));
          return false;
        } else {
          return true;
        }
      }
    }

    function reset() {
      SignUpModel.form = {};
      SignUpModel.confirmPassword = null;
    }


  }
})();
