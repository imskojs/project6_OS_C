(function() {
  'use strict';
  angular.module('app')
    .controller('BidDetailController', BidDetailController);

  BidDetailController.$inject = ['U', '$scope', 'Bids', 'BidDetailModel', 'Message', '$stateParams', '$ionicSlideBoxDelegate'];

  function BidDetailController(U, $scope, Bids, BidDetailModel, Message, $stateParams, $ionicSlideBoxDelegate) {

    var BidDetail = this;
    BidDetail.Model = BidDetailModel;

    // Used to update bid on ion-refresh
    BidDetail.getBid = getBid;

    $scope.$on('$ionicView.beforeEnter', onBeforeEnter);
    $scope.$on('$ionicView.beforeLeave', onBeforeLeave);
    $scope.$on('$ionicView.afterEnter', onAfterEnter);
    //====================================================
    //  Implementation
    //====================================================
    function getBid() {
      return Bids.findById({
          id: $stateParams.id,
          populates: 'createdBy,place,product'
        }).$promise
        .then(setView)
        .catch(findByIdError);
    }
    //====================================================
    //  View states
    //====================================================
    function onBeforeEnter() {
      console.log($stateParams.id);
      // U.reset(BidDetailModel);
      // return getBid();
    }

    function onBeforeLeave() {
      return Message.loading();
    }

    function onAfterEnter() {
      $ionicSlideBoxDelegate.update();
      $ionicSlideBoxDelegate.slide(0, 0);
      $ionicSlideBoxDelegate.enableSlide(true);
      return Message.hide();
    }
    //====================================================
    //  Helper
    //====================================================
    function setView(bid) {
      console.log(bid);
      BidDetailModel.bid = bid;
      $scope.$broadcast('scroll.refreshComplete');
      U.resize();
      return Message.hide();
    }

    function findByIdError(err) {
      console.log(err);
      $scope.$broadcast('scroll.refreshComplete');
      return Message.alert();
    }
  } //end
})();
