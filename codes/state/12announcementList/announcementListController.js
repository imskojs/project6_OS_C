(function() {
  'use strict';
  angular.module('app')
    .controller('AnnouncementListController', AnnouncementListController);

  AnnouncementListController.$inject = [
    '$scope', 'AnnouncementListModel', 'Posts', 'Message', 'U', 'Preload', '$q'
  ];

  function AnnouncementListController(
    $scope, AnnouncementListModel, Posts, Message, U, Preload, $q
  ) {
    var AnnouncementList = this;
    AnnouncementList.Model = AnnouncementListModel;
    var noLoadingStates = ['main.announcementDetail'];

    AnnouncementList.refresh = refresh;
    AnnouncementList.loadMore = loadMore;

    $scope.$on('$ionicView.beforeEnter', onBeforeEnter);
    $scope.$on('$ionicView.afterEnter', onAfterEnter);

    //====================================================
    // Initial Loading of a state;
    //====================================================
    function onBeforeEnter() {
      if (!U.areSiblingViews(noLoadingStates)) {
        AnnouncementListModel.loading = true;
      }
    }

    function onAfterEnter() {
      if (!U.areSiblingViews(noLoadingStates)) {
        return find()
          .then(function(postsWrapper) {
            console.log(postsWrapper);
            U.bindData(postsWrapper, AnnouncementListModel, 'posts');
          })
          .catch(U.error);
      }
    }

    function refresh() {
      return find()
        .then(function(postsWrapper) {
          console.log(postsWrapper);
          U.bindData(postsWrapper, AnnouncementListModel, 'posts');
        })
        .catch(U.error)
        .finally(function() {
          U.broadcast($scope);
        });
    }

    function loadMore() {
      var last = AnnouncementListModel.posts.length - 1;
      return find({
          olderThan: AnnouncementListModel.posts[last]
        })
        .then(function(postsWrapper) {
          U.appendData(postsWrapper, AnnouncementListModel, 'posts');
        })
        .catch(U.error)
        .finally(function() {
          U.broadcast($scope);
        });
    }
    //====================================================
    //  Implementations
    //====================================================
    function find(extraQuery) {
      var query = {
        category: 'notification',
        limit: 20,
        sort: 'id DESC'
      };
      angular.extend(query, extraQuery);
      return Posts.find(query).$promise
        .then(function(postsWrapper) {
          var photosPromise = Preload.photos(postsWrapper.posts, 'cloudinary200', true);
          return $q.all([postsWrapper, photosPromise]);
        })
        .then(function(array) {
          var postsWrapper = array[0];
          return postsWrapper;
        });
    }

  } //end
})();
