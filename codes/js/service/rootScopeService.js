//====================================================
//  createdBy;
// Seunghoon Ko (imskojs@gmail.com)
//====================================================

// Description: Extends $rootScope with custom functions;

// Usage;
// In app.js
// .run(['$rootScope', 'rootScopeService', function ($rootScope, rootScopeService){
//   angular.extend($rootScope, rootScopeService);
// }])
(function() {
  'use strict';

  angular.module('app')
    .factory('rootScopeService', rootScopeService);

  rootScopeService.$inject = ['$state', '$stateParams', '$ionicHistory', '$ionicSideMenuDelegate', 'Message', '$timeout', 'appStorage', '$rootScope', '_', '$ionicModal', '$ionicViewSwitcher', 'devMode'];

  function rootScopeService($state, $stateParams, $ionicHistory, $ionicSideMenuDelegate, Message, $timeout, appStorage, $rootScope, _, $ionicModal, $ionicViewSwitcher, devMode) {
    var service = {
      appStorage: appStorage,
      $state: $state,
      $stateParams: $stateParams,
      isState: isState,
      areStates: areStates,
      getState: getState,
      isParam: isParam,
      hasParam: hasParam,
      getParam: getParam,
      goToState: goToState,
      goBack: goBack,
      loading: loading,
      toggleSideMenu: toggleSideMenu,
      closeSideMenu: closeSideMenu,
      comingSoon: comingSoon,
      devMode: devMode
    };

    $ionicModal.fromTemplateUrl('state/modal/requestLogin.html', {
      scope: $rootScope,
      animation: 'mh-slide'
    }).then(function(modal) {
      $rootScope.requestLoginModal = modal;
    });

    return service;

    function isState(state) {
      return state === $ionicHistory.currentStateName();
    }

    function areStates(states) {
      return states.indexOf($ionicHistory.currentStateName()) !== -1;
    }

    function getState() {
      return $ionicHistory.currentStateName();
    }
    //====================================================
    //  $rootScope.isParam({id: '123', category: ''}) >> true | false
    //====================================================
    function isParam(paramObj) {
      for (var key in paramObj) {
        if ($state.params[key] !== paramObj[key]) {
          return false;
        }
      }
      return true;
    }

    function hasParam(paramKey) {

      if ($state.params[paramKey] !== '') {
        return true;
      } else {
        return false;
      }
    }
    //====================================================
    // $rootScope.getParam(category)  >> $stateParams[category]
    //====================================================
    function getParam(key) {
      return $state.params[key];
    }
    //====================================================
    //  $rootScope.goToState('main.home', {category: 'apple', theme: 'drink'})
    //====================================================
    function goToState(state, params, direction, showSpinner) {
      if (showSpinner) {
        loading();
      }
      if (direction) {
        $ionicViewSwitcher.nextDirection(direction);
      }
      $ionicSideMenuDelegate.toggleLeft(false);
      $state.go(state, params);
    }
    //====================================================
    //  $rootScope.goBack();
    //====================================================
    function goBack(direction) {
      if (direction) {
        $ionicViewSwitcher.nextDirection(direction);
      }
      $ionicHistory.goBack();
    }
    //====================================================
    //  $rootScope.loading();
    //====================================================
    function loading() {
      Message.loading();
      $timeout(function() {
        Message.hide();
      }, 5000);
    }
    //====================================================
    //  $rootScope.closeSideMenu();
    //====================================================
    function closeSideMenu() {
      $ionicSideMenuDelegate.toggleLeft(false);
    }
    //====================================================
    //  $rootScope.toggleSideMenu();
    //====================================================
    function toggleSideMenu(requireLoggedIn) {
      if (requireLoggedIn) {
        if (!appStorage.token) {
          return Message.alert('둘러보기 알림', '로그인을 하셔야 볼수있는 내용입니다.')
            .then(function() {
              $state.go('main.login');
            });
        }
      }
      $ionicSideMenuDelegate.toggleLeft();
    }
    //====================================================
    //  $rootScope.comingSoon();
    //====================================================
    function comingSoon(title) {
      return Message.alert(title + ' 준비중인 서비스입니다.', '빠른시일내에 준비완료하겠습니다.');
    }


  } //end
})();