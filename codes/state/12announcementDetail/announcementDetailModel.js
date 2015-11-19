(function() {
  'use strict';

  angular.module('app')
    .factory('AnnouncementDetailModel', AnnouncementDetailModel);

  AnnouncementDetailModel.$inject = [];

  function AnnouncementDetailModel() {

    var model = {
      post: {
        title: 'test',
        content: 'test test',
        createdAt: null,
      }
    };
    return model;
  }
})();
