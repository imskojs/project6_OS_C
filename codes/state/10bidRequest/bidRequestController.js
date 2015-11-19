(function() {
  'use strict';
  angular.module('app')
    .controller('BidRequestController', BidRequestController);

  BidRequestController.$inject = ['U', '$scope', 'Posts', 'BidRequestModel', 'Message', '$stateParams'];

  function BidRequestController(U, $scope, Posts, BidRequestModel, Message, $stateParams) {

    var BidRequest = this;
    BidRequest.Model = BidRequestModel;

    // Used to update post on ion-refresh
    BidRequest.getPost = getPost;

    $scope.$on('$ionicView.beforeEnter', onBeforeEnter);
    $scope.$on('$ionicView.beforeLeave', onBeforeLeave);
    $scope.$on('$ionicView.afterEnter', onAfterEnter);
    //====================================================
    //  Implementation
    //====================================================
    function getPost() {
      return Posts.findById({
          id: $stateParams.id,
          populates: 'photos'
        }).$promise
        .then(setView)
        .catch(findByIdError);
    }
    //====================================================
    //  View states
    //====================================================
    function onBeforeEnter() {
      console.log($stateParams.id);
      U.reset(BidRequestModel);
      return getPost();
    }

    function onBeforeLeave() {
      return Message.loading();
    }

    function onAfterEnter() {
      return Message.hide();
    }
    //====================================================
    //  Helper
    //====================================================
    function setView(post) {
      console.log(post);
      BidRequestModel.post = post;
      U.resize();
      return Message.hide();
    }

    function findByIdError(err) {
      console.log(err);
      return Message.alert();
    }

  } //end
})();
