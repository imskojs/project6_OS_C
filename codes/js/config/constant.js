(function() {
  'use strict';

  angular.module('app')
  // .constant("governorUrl", "http://52.192.13.221")
  .constant("governorUrl", "http://192.168.0.65:1337")
    .constant("appName", "ohShop")
    .constant("appId", 7)
    .constant("googlePushSenderID", "350504486209")
    .constant("kakaoKey", "bdb254de02ea0b7521635ba469608674")
    .constant("facebookKey", "801820753200919")
    .constant("devMode", false);
})();
