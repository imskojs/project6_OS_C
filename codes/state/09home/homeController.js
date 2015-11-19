(function() {
  'use strict';
  angular.module('app')
    .controller('HomeController', HomeController);

  HomeController.$inject = ['HomeModel'];

  function HomeController(HomeModel) {

    var Home = this;
    Home.Model = HomeModel;

    //------------------------
    //  IMPLEMENTATIONS
    //------------------------

  }
})();
