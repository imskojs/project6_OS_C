(function() {
  'use strict';

  angular.module('app')
    .factory('FaqListModel', FaqListModel);

  FaqListModel.$inject = [];

  function FaqListModel() {

    var model = {
      posts: [{
        title: '첫번째 공지사항'
      }, {
        title: '두번째 공지사항'
      }],
      more: false
    };
    return model;
  }
})();
