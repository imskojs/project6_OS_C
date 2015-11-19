//====================================================
//  createBy;
// Seunghoon Ko (imskojs@gmail.com)
//====================================================

// Dependencies
//Cordova InAppBrowser
//Cordova SocialSharing
(function() {
  'use strict';

  angular.module('app')
    .factory('LinkService', LinkService);

  LinkService.$inject = ['$window', '$cordovaSocialSharing', 'appStorage', 'Message', '$state'];

  function LinkService($window, $cordovaSocialSharing, appStorage, Message, $state) {

    var service = {
      call: call,
      open: open,
      share: share
    };
    return service;

    //====================================================
    //  LinkService.call Usage
    //====================================================
    //LinkService.call(01011010101)
    // Output
    //phone call
    function call(number) {
      console.log(number);
      if (!appStorage.token) {
        return Message.alert('전화걸기 알림', '로그인을 해주세요.').then(function() {
          $state.go('main.login');
        });
      }
      $window.location.href = 'tel:' + number;
    }

    //====================================================
    //  LinkService.openLink Usage
    //====================================================
    //LinkService.openLink('http://www.applicat.co.kr');
    // Output
    //InAppBrowser open new window with url
    function open(link) {
      return $window.open(link, '_system');
    }

    //====================================================
    //  LinkService.share Usage
    //====================================================
    // LinkService.share('my title', 'my content stuff', 'http://www.applicat.co.kr')
    // Output
    //Social Share title content and link
    function share(title, content, url) {
      return $cordovaSocialSharing
        .share(title, content, null, url)
        .then(function(suc) {
          console.log(suc);
        }, function(err) {
          console.log(err);
        });
    }
  }
})();
