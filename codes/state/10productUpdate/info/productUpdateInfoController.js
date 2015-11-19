(function() {
  'use strict';
  angular.module('app')
    .controller('ProductUpdateInfoController', ProductUpdateInfoController);

  ProductUpdateInfoController.$inject = ['ProductUpdateModel', 'Message', 'U', '$scope'];

  function ProductUpdateInfoController(ProductUpdateModel, Message, U, $scope) {

    var ProductUpdateInfo = this;
    ProductUpdateInfo.Model = ProductUpdateModel;

    $scope.$on('$ionicView.beforeEnter', function() {
      U.resize();
    });


  } //end
})();
