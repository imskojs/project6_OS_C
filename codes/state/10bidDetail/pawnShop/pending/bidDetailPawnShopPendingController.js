(function() {
  'use strict';
  angular.module('app')
    .controller('BidDetailPawnShopPendingController', BidDetailPawnShopPendingController);

  BidDetailPawnShopPendingController.$inject = ['BidDetailPawnShopPendingModel', 'Bids', '$state', 'U', 'Message', 'Preload'];

  function BidDetailPawnShopPendingController(BidDetailPawnShopPendingModel, Bids, $state, U, Message, Preload) {

    var BidDetailPawnShopPending = this;
    BidDetailPawnShopPending.Model = BidDetailPawnShopPendingModel;

    BidDetailPawnShopPending.updateBid = updateBid;

    function updateBid() {
      Message.loading();
      var query = {};
      angular.extend(query, BidDetailPawnShopPendingModel.form);
      query.id = $state.params.id;
      query.status = 'responded';

      return Bids
        .update({}, query)
        .$promise
        .then(function(bid) {
          console.log(bid);
          return Preload.stateWithBids('main.bidListPawnShopResponded', {
            category: 'pawnShop',
            status: 'responded'
          }, false);
        })
        .then(function() {
          Message.hide();
          return Message.alert('견적보내기 알림', '견적을 성공적으로 보냈습니다.');
        })
        .then(function() {
          U.goToState('main.bidListPawnShopResponded', {
            category: 'pawnShop',
            status: 'responded'
          }, 'forward');

        })
        .catch(U.error);
    }


  } //end
})();
