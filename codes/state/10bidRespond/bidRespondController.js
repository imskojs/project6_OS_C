(function() {
  'use strict';
  angular.module('app')
    .controller('BidRespondController', BidRespondController);

  BidRespondController.$inject = [
    'U', '$scope', 'Bids', 'BidRespondModel', 'Message', '$stateParams',
    '$ionicSlideBoxDelegate', '$filter'
  ];

  function BidRespondController(
    U, $scope, Bids, BidRespondModel, Message, $stateParams,
    $ionicSlideBoxDelegate, $filter
  ) {

    var BidRespond = this;
    BidRespond.Model = BidRespondModel;

    BidRespond.getBid = getBid;
    BidRespond.respondToBid = respondToBid;

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

    function respondToBid() {
      var ok = validateBid();
      if (!ok) {
        return false;
      }
      BidRespondModel.form.status = 'responded';
      return Bids.updateBid({
          id: $stateParams.id,
        }, BidRespondModel.form).$promise
        .then(respondToBidSuccess)
        .catch(updateBidError);
    }
    //====================================================
    //  View states
    //====================================================
    function onBeforeEnter() {
      console.log($stateParams.id);
      // U.reset(BidRespondModel.bid);
      // U.reset(BidRespondModel.form);
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
      Message.hide();
    }

    function findByIdError(err) {
      console.log(err);
      return Message.alert();
    }

    function alert(message) {
      return Message.alert.bind(null, $filter('translate')('SEND_BID_ALERT'))(message);
    }

    function validateBid() {
      var form = BidRespondModel.form;
      if (!form.price) {
        alert($filter('translate')('INPUT_PRICE'));
        return false;
      } else if (!form.monthlyInterest) {
        alert($filter('translate')('MONTHLY_INTEREST'));
        return false;
      } else if (!form.duration) {
        alert($filter('translate')('INPUT_DURATION'));
        return false;
      } else if (typeof form.canPickUp !== 'boolean') {
        alert($filter('translate')('INPUT_DELIVERY'));
        return false;
      }
      return true;
    }

    function respondToBidSuccess(bid) {
      console.log(bid);
      Message.alert(
        $filter('translate')('SEND_BID_ALERT'),
        $filter('translate')('BID_SENT')
      );
    }

    function updateBidError(err) {
      console.log(err);
      return Message.alert();
    }


  } //end
})();
