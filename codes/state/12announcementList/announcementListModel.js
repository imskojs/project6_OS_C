(function() {
  'use strict';

  angular.module('app')
    .factory('AnnouncementListModel', AnnouncementListModel);

  AnnouncementListModel.$inject = [];

  function AnnouncementListModel() {

    var model = {
      posts: [{
        id: 'test1',
        title: '첫번째 공지사항',
        createdAt: new Date()
      }, {
        id: 'test2',
        title: '두번째 공지사항',
        createdAt: new Date()
      }],
      more: false
    };
    return model;
  }
})();
