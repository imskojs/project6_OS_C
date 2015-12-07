(function() {
  'use strict';
  angular.module('app')
    .controller('TermDetailController', TermDetailController);

  TermDetailController.$inject = [
    '$scope', 'TermDetailModel', 'Posts', 'Message', 'U', 'Preload', '$q'
  ];

  function TermDetailController(
    $scope, TermDetailModel, Posts, Message, U, Preload, $q
  ) {
    var TermDetail = this;
    TermDetail.Model = TermDetailModel;

    TermDetail.refresh = refresh;

    $scope.$on('$ionicView.beforeEnter', onBeforeEnter);
    $scope.$on('$ionicView.afterEnter', onAfterEnter);

    //====================================================
    // Initial Loading of a state;
    //====================================================
    function onBeforeEnter() {
      // TermDetailModel.loading = true;
    }

    function onAfterEnter() {
      // return findOne()
      //   .then(function(post) {
      //     console.log(post);
      //     U.bindData(post, TermDetailModel, 'post');
      //   })
      //   .catch(U.error);
    }

    function refresh() {
      // return findOne()
      //   .then(function(post) {
      //     console.log(post);
      //     U.bindData(post, TermDetailModel, 'post');
      //   })
      //   .catch(U.error)
      //   .finally(function() {
      //     U.broadcast($scope);
      //   });
    }

    //====================================================
    //  Implementations
    //====================================================
    function findOne(extraQuery) {
      var query = {
        category: 'term'
      };
      angular.extend(query, extraQuery);
      return Posts.find(query).$promise
        .then(function(postsWrapper) {
          var photosPromise = Preload.photos(postsWrapper.posts, 'cloudinary200', true);
          return $q.all([postsWrapper, photosPromise]);
        })
        .then(function(array) {
          var postsWrapper = array[0];
          var post = postsWrapper.posts && postsWrapper.posts[0];
          return post;
        });
    }

  } //end
})();
