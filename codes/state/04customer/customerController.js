(function() {
  'use strict';
  angular.module('app')
    .controller('CustomerController', CustomerController);

  CustomerController.$inject = ['$scope', 'CustomerModel', 'Message'];

  function CustomerController($scope, CustomerModel, Message) {

    var Customer = this;
    Customer.Model = CustomerModel;


    $scope.$on('$ionicView.afterEnter', onAfterEnter);
    //====================================================
    //  Implementation
    //====================================================
    function onAfterEnter() {
      Message.hide();
    }
  }
})();
