(function() {
  'use strict';
  angular.module('app')
    .controller('FaqDetailController', FaqDetailController);

  FaqDetailController.$inject = [
    '$scope', 'FaqDetailModel', 'Posts', 'Message', 'U', 'Preload', '$q',
    '$state'
  ];

  function FaqDetailController(
    $scope, FaqDetailModel, Posts, Message, U, Preload, $q,
    $state
  ) {
    var FaqDetail = this;
    FaqDetail.Model = FaqDetailModel;

    FaqDetail.refresh = refresh;

    $scope.$on('$ionicView.beforeEnter', onBeforeEnter);
    $scope.$on('$ionicView.afterEnter', onAfterEnter);

    //====================================================
    // Initial Loading of a state;
    //====================================================
    function onBeforeEnter() {
      FaqDetailModel.loading = true;
    }

    function onAfterEnter() {
      return findOne()
        .then(function(post) {
          console.log(post);
          U.bindData(post, FaqDetailModel, 'post');
        })
        .catch(U.error);
    }

    function refresh() {
      return findOne()
        .then(function(post) {
          console.log(post);
          U.bindData(post, FaqDetailModel, 'post');
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
          var photosPromise = Preload.photos(post, 'cloudinary200', true);
          return $q.all([post, photosPromise]);
        })
        .then(function(array) {
          var post = array[0];
          return post;
        });
    }

  } //end
})();
