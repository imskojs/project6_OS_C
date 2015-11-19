(function() {
  'use strict';
  angular.module('app')
    .controller('ResetPasswordController', ResetPasswordController);

  ResetPasswordController.$inject = ['ResetPasswordModel', 'Message', 'Users', 'U', '$scope'];

  function ResetPasswordController(ResetPasswordModel, Message, Users, U, $scope) {

    var ResetPassword = this;
    ResetPassword.Model = ResetPasswordModel;

    ResetPassword.sendForm = sendForm;

    $scope.$on('$ionicView.beforeEnter', function() {
      ResetPasswordModel.form = {};
      ResetPasswordModel.confirmPassword = null;
    });

    function sendForm() {
      console.log("---------- 'test' ----------");
      console.log('test');
      console.log("HAS TYPE: " + typeof 'test');
      console.log("---------- CONSOLE END -------------------");
      if (!validate()) {
        return false;
      }

      Users.changePassword({}, ResetPasswordModel.form).$promise
        .then(function(message) {
          return Message.alert('비밀번호변경 알림', message.message);
        })
        .then(function() {
          U.goBack();
        })
        .catch(function(err) {
          console.log(err);
          ResetPasswordModel.form = {};
          ResetPasswordModel.confirmPassword = null;
          Message.alert('비밀번호변경 알림', err.data.message);
        });
    }

    //------------------------
    //  IMPLEMENTATIONS
    //------------------------
    //====================================================
    //  Helper
    //====================================================
    function validate() {
      var form = ResetPasswordModel.form;

      if (form.newPassword !== ResetPasswordModel.confirmPassword) {
        Message.alert('비민번호 변경 알림', '새 비밀번호와 재입력한 비밀번호가 다릅니다.');
        ResetPasswordModel.form = {};
        ResetPasswordModel.confirmPassword = null;
        return false;
      }
      return true;
    }
  }
})();
