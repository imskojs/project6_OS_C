(function() {
  'use strict';
  angular.module('app')
    .controller('LoginController', LoginController);

  LoginController.$inject = [
    '$scope', '$state', '$q', '$ionicModal', '$translate',
    'Users', 'Places', 'LoginModel', 'Message', 'appStorage',
    'Preload', 'U', 'Devices', '$filter'
  ];

  function LoginController(
    $scope, $state, $q, $ionicModal, $translate,
    Users, Places, LoginModel, Message, appStorage,
    Preload, U, Devices, $filter
  ) {

    var Login = this;
    Login.Model = LoginModel;

    Login.login = login;
    Login.lookAround = lookAround;
    Login.selectLanguage = selectLanguage;

    $scope.$on('$ionicView.enter', onEnter);
    //====================================================
    //  Implementation
    //====================================================

    function login() {
      Message.loading();
      return Users.login({}, {
          identifier: LoginModel.form.email,
          password: LoginModel.form.password
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
        })
        .catch(function(err) {
          console.log('err');
          console.log(err);
          Message.hide();
          Message.alert(
              $filter('translate')('LOGIN_ALERT'),
              $filter('translate')('EMAIL_PASSWORD_WRONG')
            )
            .then(function() {
              LoginModel.form = {};
            });
        });
    }

    function lookAround() {
      if (!appStorage.user) {
        appStorage.user = {};
      }
      appStorage.user.role = 'user';
      appStorage.user.lookAround = true;

      // U.goToState('main.productList.market')
      return Preload.stateWithProducts('main.productList.market', {
          category: 'market'
        }, true, 'forward')
        .catch(U.error);
    }

    function selectLanguage(language) {
      $translate.use(language);
      Login.languageModal.hide();
    }

    function onEnter() {
      LoginModel.form = {};
      var promise = $q.resolve();
      if (!Login.languageModal) {
        promise = promise.then(function() {
            return $ionicModal.fromTemplateUrl('state/modal/selectLanguage.html', {
              scope: $scope,
              animation: 'slide-in-up'
            });
          })
          .then(function(modal) {
            Login.languageModal = modal;
          });
      }
      promise.then(function() {
        Login.languageModal.show();
      });
    }

    //====================================================
    //  Helper
    //====================================================
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

  } //END
})();
