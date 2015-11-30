(function() {
  'use strict';
  angular.module('app')
    .controller('CustomerController', CustomerController);

  CustomerController.$inject = [
    '$scope', '$state',
    'CustomerModel', 'Message', 'appStorage', 'Contacts'
  ];

  function CustomerController(
    $scope, $state,
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
        return Message.alert('고객센터 알림', '로그인/회원가입을 하셔야 합니다.')
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
          Message.alert('고객문의 알림', '고객문의가 성공적으로 접수 되었습니다. 가입하신 이메일로 연락 드리겠습니다.')
            .then(function() {
              $state.go('main.productList.market');
            });
        })
        .catch(function(err) {
          console.log("---------- err ----------");
          console.log(err);
          console.log("HAS TYPE: " + typeof err);
          Message.hide();
          Message.alert('고객문의 알림', '제목과 내용은 필수 사항입니다.');

        });

    }
  }
})();
