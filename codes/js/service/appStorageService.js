(function() {
  'use strict';

  angular.module('app')
    .factory('appStorage', appStorage);

  appStorage.$inject = ['$localStorage', 'appName'];

  function appStorage($localStorage, appName) {

    setInitialState();

    return $localStorage[appName];

    //====================================================
    //  Implementations
    //====================================================
    function setInitialState() {
      if (!$localStorage[appName]) {
        $localStorage[appName] = {};
      }
      var storage = $localStorage[appName];
      if (storage.firstTime === undefined) {
        storage.firstTime = true;
      }
    }

    //====================================================
    //  Helper
    //====================================================
  }
})();
