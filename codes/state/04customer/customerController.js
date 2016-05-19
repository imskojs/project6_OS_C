(function() {
  'use strict';
  angular.module('app')
    .controller('CustomerController', CustomerController);

  CustomerController.$inject = [
    '$scope', '$state', '$filter',
    'CustomerModel', 'Message', 'appStorage', 'Contacts'
  ];

  function CustomerController(
    $scope, $state, $filter,
    CustomerModel, Message, appStorage, Contacts
  ) {

    var Customer = this;
    Customer.Model = CustomerModel;

    Customer.sendForm = sendForm;

    $scope.$on('$ionicView.afterEnter', onAfterEnter);
    //====================================================
    //  Implementation
    //====================================================
    function onAfterEnter() {
      Message.hide();
    }

    function sendForm() {
      if (!appStorage.token) {
        return Message.alert(
            $filter('translate')('CUSTOMER_CENTER_ALERT'),
            $filter('translate')('LOGIN_SIGNUP_NEEDED')
          )
          .then(function() {
            $state.go('main.login');
          });
      }
      Message.loading();
      Contacts.contactAdmin({},
          CustomerModel.form
        ).$promise
        .then(function success() {
          CustomerModel.form = {};
          Message.hide();
          Message.alert(
              $filter('translate')('CUSTOMER_CENTER_ALERT'),
              $filter('translate')('QUERY_SENT_WAIT_REPLY')
            )
            .then(function() {
              $state.go('main.productList.market');
            });
        })
        .catch(function(err) {
          console.log("---------- err ----------");
          console.log(err);
          console.log("HAS TYPE: " + typeof err);
          Message.hide();
          Message.alert(
            $filter('translate')('QUERY_ALERT'),
            $filter('translate')('TITLE_CONTENT_NEEDED')
          );

        });

    }
  }
})();
