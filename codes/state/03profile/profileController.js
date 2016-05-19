(function() {
  'use strict';
  angular.module('app')
    .controller('ProfileController', ProfileController);

  ProfileController.$inject = [
    'U', '$scope', 'Places', 'Users', 'ProfileModel', 'Message',
    'ImageService', '$ionicSlideBoxDelegate', '$timeout',
    'appStorage', '$state', 'Preload', '$q', 'daum', '$filter'
  ];

  function ProfileController(
    U, $scope, Places, Users, ProfileModel, Message,
    ImageService, $ionicSlideBoxDelegate, $timeout,
    appStorage, $state, Preload, $q, daum, $filter
  ) {

    var Profile = this;
    Profile.Model = ProfileModel;
    var noLoadingStates = ['main.resetPassword'];

    Profile.sendFormUser = sendFormUser;
    // Used to update place on ion-refresh
    Profile.getImage = getImage;
    Profile.sendFormPlace = sendFormPlace;

    $scope.$on('$ionicView.beforeEnter', onBeforeEnter);
    $scope.$on('$ionicView.afterEnter', onAfterEnter);
    //====================================================
    // Initial State
    //====================================================

    //====================================================
    //  For User : Initial State
    //====================================================
    function onBeforeEnter() {
      if (!U.areSiblingViews(noLoadingStates)) {
        ProfileModel.loading = true;
      }
    }

    function onAfterEnter() {
      if (!U.areSiblingViews(noLoadingStates) && $state.params.category === 'user') {
        return findOneUser()
          .then(function(user) {
            console.log(user);
            U.bindData(user, ProfileModel, 'user');
          })
          .catch(U.error);
      } else if (!U.areSiblingViews(noLoadingStates) && $state.params.category === 'pawnShop') {
        $q.all([findOnePlaceOwner(), findOnePlace()])
          .then(function(array) {
            var placeOwner = array[0];
            var place = array[1];
            U.bindData(placeOwner, ProfileModel, 'user');
            U.bindData(place, ProfileModel, 'place');
          })
          .catch(U.error);
      }
    }

    function sendFormUser() {
      var nickname = ProfileModel.user.nickname;
      var email = ProfileModel.user.email;
      var username = ProfileModel.user.email;
      return updateUser({
          id: $state.params.id,
          nickname: nickname,
          email: email,
          username: username
        })
        .then(function(user) {
          console.log(user);
          U.bindData(user, ProfileModel, 'user');
          appStorage.user.nickname = user.nickname;
          appStorage.user.email = user.email;
          appStorage.user.username = user.username;
          Message.alert(
            $filter('translate')('PROFILE_UPDATE_ALERT'),
            $filter('translate')('UPDATE_COMPLETE'));
        })
        .catch(U.error);
    }

    //====================================================
    // User: Implementation
    //====================================================
    function findOneUser(extraQuery) {
      var query = {
        id: $state.params.id,
        populates: ['roles']
      };
      angular.extend(query, extraQuery);
      return Users.findOne(query).$promise
        .then(function(user) {
          var photosPromise = Preload.photos(user, 'cloudinary200', false);
          return $q.all([user, photosPromise]);
        })
        .then(function(array) {
          var user = array[0];
          return user;
        });
    }

    function updateUser(extraQuery) {
      var query = {
        id: $state.params.id
      };
      angular.extend(query, extraQuery);
      return Users.update(query).$promise
        .then(function(user) {
          var photosPromise = Preload.photos(user, 'cloudinary600', false);
          return $q.all([user, photosPromise]);
        })
        .then(function(array) {
          var user = array[0];
          console.log(user);
          return user;
        });
    }

    //====================================================
    // Place : Initial State
    //====================================================
    function findOnePlaceOwner(extraQuery) {
      var query = {
        id: $state.params.id
      };
      angular.extend(query, extraQuery);
      return Users.findOne(query).$promise
        .then(function(placeOwner) {
          var photosPromise = Preload.photos(placeOwner, 'cloudinary600', false);
          return $q.all([placeOwner, photosPromise]);
        })
        .then(function(array) {
          var placeOwner = array[0];
          return placeOwner;
        });
    }

    function findOnePlace(extraQuery) {
      var query = {
        id: appStorage.place.id,
        populates: ['photos']
      };
      angular.extend(query, extraQuery);
      return Places.findOne(query).$promise
        .then(function(place) {
          var photosPromise = Preload.photos(place, 'cloudinary600', false);
          return $q.all([place, photosPromise]);
        })
        .then(function(array) {
          var place = array[0];
          return place;
        });
    }

    function getImage(sourceType) {
      return ImageService.get({
          from: sourceType,
          fileUris: ProfileModel.fileUris,
          dataUris: ProfileModel.dataUris
        })
        .then(function() {
          $timeout(function() {
            $ionicSlideBoxDelegate.$getByHandle('update-slide').update();
          }, 0);
        });
    }

    function updatePlaceOwner(extraQuery) {
      var query = {
        id: $state.params.id
      };
      angular.extend(query, extraQuery);
      return Users.update(query).$promise
        .then(function(user) {
          var photosPromise = Preload.photos(user, 'cloudinary600', false);
          return $q.all([user, photosPromise]);
        })
        .then(function(array) {
          var user = array[0];
          console.log(user);
          return user;
        });
    }


    function sendFormPlace() {
      delete ProfileModel.user.$promise;
      delete ProfileModel.user.$resolved;
      delete ProfileModel.user.createdAt;
      delete ProfileModel.user.gravatarUrl;
      delete ProfileModel.user.owner;
      delete ProfileModel.user.updatedAt;
      delete ProfileModel.user.geoJSON;
      ProfileModel.user.username = ProfileModel.user.email;
      var placeOwnerPromise = updatePlaceOwner(ProfileModel.user);

      var placeId = ProfileModel.place.id;
      angular.extend(ProfileModel.place, ProfileModel.user);
      ProfileModel.place.id = placeId;
      delete ProfileModel.place.$promise;
      delete ProfileModel.place.$resolved;
      delete ProfileModel.place.createdAt;
      delete ProfileModel.place.gravatarUrl;
      delete ProfileModel.place.owner;
      delete ProfileModel.place.updatedAt;
      delete ProfileModel.place.geoJSON;
      if (ProfileModel.dataUris.length > 0 || ProfileModel.place.photos.length === 0) {
        delete ProfileModel.place.photos;
      }
      var placePromise = ImageService.post({
        url: '/place',
        dataUris: ProfileModel.dataUris,
        fields: ProfileModel.place
      }, 'PUT');
      $q.all([placeOwnerPromise, placePromise])
        .then(function(array) {
          var placeOwner = array[0];
          var place = array[1].data[0];
          appStorage.place = place;
          appStorage.user = placeOwner;
          ProfileModel.user = placeOwner;
          ProfileModel.place = place;
          if (!ProfileModel.place.photos) {
            ProfileModel.place.photos = [];
          }
          ProfileModel.dataUris = [];
          ProfileModel.fileUris = [];
          return Message.alert(
            $filter('translate')('PROFILE_UPDATE_ALERT'),
            $filter('translate')('UPDATE_COMPLETE')
          );
        })
        .catch(function(err) {
          console.log(err);
          Message.alert();
        });
    }

    //====================================================
    //  Helper
    //====================================================
    // function searchPlace() {
    //   if (!ProfileModel.form.address) {
    //     return false;
    //   }
    //   var ps = new daum.maps.services.Places();
    //   Message.loading();
    //   ps.keywordSearch(ProfileModel.form.address, function(status, data) {
    //     // if no search result, notify and exit.
    //     Message.hide();
    //     if (data.places[0] === undefined) {
    //       Message.alert(
    //         '요청하신 장소가 없습니다',
    //         '다시검색해주세요'
    //       );
    //       return false;
    //     }
    //     ProfileModel.places = data.places;
    //     console.log(data.places);

    //   }, function(err) {
    //     console.log(err);
    //     Message.hide();
    //     Message.alert();
    //   });
    // }
    // function selectPlace(placeObj) {
    //   ProfileModel.form.address = placeObj.address;
    //   ProfileModel.form.geoJSON = {
    //     type: 'Point',
    //     coordinates: [Number(placeObj.longitude), Number(placeObj.latitude)]
    //   };
    //   ProfileModel.places = [];
    //   U.resize();
    //   console.log(ProfileModel.form.address);
    //   console.log(ProfileModel.form.geoJSON);
    //   console.log(typeof ProfileModel.form.geoJSON.coordinates[0]);
    // }

  } //end
})();
