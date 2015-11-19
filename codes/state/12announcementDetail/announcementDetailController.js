(function() {
  'use strict';
  angular.module('app')
    .controller('AnnouncementDetailController', AnnouncementDetailController);

  AnnouncementDetailController.$inject = [
    '$scope', 'AnnouncementDetailModel', 'Posts', 'Message', 'U', 'Preload', '$q',
    '$state'
  ];

  function AnnouncementDetailController(
    $scope, AnnouncementDetailModel, Posts, Message, U, Preload, $q,
    $state
  ) {
    var AnnouncementDetail = this;
    AnnouncementDetail.Model = AnnouncementDetailModel;

    AnnouncementDetail.refresh = refresh;

    $scope.$on('$ionicView.beforeEnter', onBeforeEnter);
    $scope.$on('$ionicView.afterEnter', onAfterEnter);

    //====================================================
    // Initial Loading of a state;
    //====================================================
    function onBeforeEnter() {
      AnnouncementDetailModel.loading = true;
    }

    function onAfterEnter() {
      return findOne()
        .then(function(post) {
          console.log(post);
          U.bindData(post, AnnouncementDetailModel, 'post');
        })
        .catch(U.error);
    }

    function refresh() {
      return findOne()
        .then(function(post) {
          console.log(post);
          U.bindData(post, AnnouncementDetailModel, 'post');
        })
        .catch(U.error)
        .finally(function() {
          U.broadcast($scope);
        });
    }

    //====================================================
    //  Implementations
    //====================================================
    function findOne(extraQuery) {
      var query = {
        id: $state.params.id
      };
      angular.extend(query, extraQuery);
      return Posts.findOne(query).$promise
        .then(function(post) {
          var photosPromise = Preload.photos(post, 'cloudinary200', false);
          return $q.all([post, photosPromise]);
        })
        .then(function(array) {
          var post = array[0];
          return post;
        });
    }

  } //end
})();
