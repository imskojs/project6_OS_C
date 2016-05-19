(function() {
  'use strict';
  angular.module('app')
    .factory('Message', Message);

  Message.$inject = ['$ionicLoading', '$ionicPopup', '$filter'];

  function Message($ionicLoading, $ionicPopup, $filter) {
    var service = {
      loading: loadingDefault,
      hide: loadingHide,
      success: messageSuccess,
      error: messageError,
      alert: popUpAlertDefault
    };

    return service;

    function loadingDefault(message) {
      $ionicLoading.show(message);
    }

    function messageSuccess(message) {
      $ionicLoading.show({
        template: '<h4 class="message-success">' + message + '</h4>',
        duration: 2000
      });
    }

    function messageError(message) {
      $ionicLoading.show({
        template: '<h4 class="message-error">' + message + '</h4>',
        duration: 2000
      });
    }

    function loadingHide() {
      $ionicLoading.hide();
    }

    function popUpAlertDefault(title, message) {
      return $ionicPopup.alert({
        title: title || $filter('translate')('INTERNET_IS_OFF'),
        template: message || $filter('translate')('TURN_ON_INTERNET')
      });
    }


  }


})();
