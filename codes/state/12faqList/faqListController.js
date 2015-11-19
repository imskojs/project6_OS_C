(function() {
  'use strict';
  angular.module('app')
    .controller('FaqListController', FaqListController);

  FaqListController.$inject = [
    '$scope', 'FaqListModel', 'Posts', 'Message', 'U', 'Preload', '$q'
  ];

  function FaqListController(
    $scope, FaqListModel, Posts, Message, U, Preload, $q
  ) {
    var FaqList = this;
    FaqList.Model = FaqListModel;
    var noLoadingStates = ['main.faqDetail'];

    FaqList.refresh = refresh;
    FaqList.loadMore = loadMore;

    $scope.$on('$ionicView.beforeEnter', onBeforeEnter);
    $scope.$on('$ionicView.afterEnter', onAfterEnter);

    //====================================================
    // Initial Loading of a state;
    //====================================================
    function onBeforeEnter() {
      if (!U.areSiblingViews(noLoadingStates)) {
        FaqListModel.loading = true;
      }
    }

    function onAfterEnter() {
      if (!U.areSiblingViews(noLoadingStates)) {
        return find()
          .then(function(postsWrapper) {
            console.log(postsWrapper);
            U.bindData(postsWrapper, FaqListModel, 'posts');
          })
          .catch(U.error);
      }
    }

    function refresh() {
      return find()
        .then(function(postsWrapper) {
          console.log(postsWrapper);
          U.bindData(postsWrapper, FaqListModel, 'posts');
        })
        .catch(U.error)
        .finally(function() {
          U.broadcast($scope);
        });
    }

    function loadMore() {
      var last = FaqListModel.posts.length - 1;
      return find({
          olderThan: FaqListModel.posts[last]
        })
        .then(function(postsWrapper) {
          U.appendData(postsWrapper, FaqListModel, 'posts');
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
        category: 'faq',
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
