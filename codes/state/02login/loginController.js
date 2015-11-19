(function() {
  'use strict';
  angular.module('app')
    .controller('LoginController', LoginController);

  LoginController.$inject = ['$scope', 'Users', 'Places', 'LoginModel', 'Message', 'appStorage', '$state', '$q', 'Preload', 'U'];

  function LoginController($scope, Users, Places, LoginModel, Message, appStorage, $state, $q, Preload, U) {

    var Login = this;
    Login.Model = LoginModel;

    Login.login = login;
    Login.lookAround = lookAround;

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
          Message.alert('로그인 알림', '이메일이나 암호가 잘못 되었습니다.')
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

    function onEnter() {
      LoginModel.form = {};
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
