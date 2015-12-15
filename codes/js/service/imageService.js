//  Dependencies
//ng-file-uploead
//cordovaCamera
//cordovaFile
//MessageService
(function() {
  'use strict';

  angular.module('app')
    .factory('ImageService', ImageService);

  ImageService.$inject = ['governorUrl', '$cordovaCamera', '$cordovaFile', 'Message', '$window', '$timeout', 'Upload'];

  function ImageService(governorUrl, $cordovaCamera, $cordovaFile, Message, $window, $timeout, Upload) {

    var service = {
      get: get,
      post: post,
      clean: clean,

    };

    return service;

    //====================================================
    //  ImageService.get Usage
    //====================================================
    //ImageService.get({
    //  from: 'camera', // or gallery
    //  fileUris: arrayToSaveFiles,
    //  dataUris: arrayToSaveBase64Data
    //})
    // Output:
    //arrayToSaveFiles.push(filePath);
    //arrayToSaveBase64Data.push(base64Data);
    function get(params, index) {
      if (!$window.cordova) return false;

      return $cordovaCamera.getPicture(setOptions())

      .then(function success(filePath) {
        // Save file path (binary data).
        if (index >= 0) {
          params.fileUris.splice(index, 1, null);
          params.fileUris.splice(index, 1, filePath);
        } else {
          params.fileUris.push(filePath);
        }
        // Read data(base64) from file path
        var name = filePath.substr(filePath.lastIndexOf('/') + 1);
        var namePath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
        return $cordovaFile.readAsDataURL(namePath, name);
      })

      .then(function success(dataUri) {
        // Save data(base64)
        $timeout(function() {
          if (index >= 0) {
            params.dataUris.splice(index, 1, null);
            params.dataUris.splice(index, 1, dataUri);
          } else {
            params.dataUris.push(dataUri);
          }
        }, 0);
      })

      .catch(function error(err) {
        Message.alert('이미지 알림', '이미지 불러오기 실패하였습니다. 갤러리에서 선택해주세요.');
        console.log(err);
      });

      // .done();

      //  getImage helper
      function setOptions() {
        var sourceType;
        if (params.from === 'gallery') {
          sourceType = 0;
        } else if (params.from === 'camera') {
          sourceType = 1;
        }
        var options = {
          allowEdit: true,
          quality: 40,
          destinationType: Camera.DestinationType.FILE_URI,
          encodingType: Camera.EncodingType.JPEG,
          targetWidth: 800,
          correctOrientation: true,
          mediaType: Camera.MediaType.PICTURE,
          cameraDirection: Camera.Direction.BACK,
          sourceType: sourceType
        };
        return options;
      } // end setOptions
    } // end getImage
    //====================================================
    //  ImageService.post Usage
    //====================================================
    //ImageService.post({
    //  url: '/place'
    //  dataUris: arrayOfBase64Data,
    //  fields: {title: '포스트 이름', content: '냠냠냠', ...}
    //})
    // Output:
    //Promise
    // Output Usage:
    //Promise
    //.then(function success(createdPlaceWrapper){
    //  console.log(createdPlaceWrapper.data);
    //})
    //.catch(function error(err){
    //  throw new Error(err);
    //})
    function post(params, method) {
      var dataUris = params.dataUris;
      console.log(dataUris);
      var fields = params.fields;
      var url = params.url;
      if (url[0] !== '/') {
        url = '/' + url;
      }
      // Wrap dataUris in array IF it is not an array.
      dataUris = wrapInArray(dataUris);
      // Convert base64 image to file
      var filesToSend = [];
      angular.forEach(dataUris, function(base64Data) {
        if (base64Data != null) {
          filesToSend.push(base64ToFile(base64Data));
        }
      });

      console.log("---------- filesToSend ----------");
      console.log(filesToSend);
      console.log("HAS TYPE: " + typeof filesToSend);

      var promise = Upload.upload({
        url: governorUrl + url,
        method: method || 'POST',
        file: filesToSend,
        fields: fields,
        header: {
          enctype: "multipart/form-data"
            // Authoriztion: "Bearer " + appStorage.token
        }
      });
      return promise;
    } //end post

    function clean() {
      return $cordovaCamera.cleanup();
    }

    //====================================================
    //  HELPERS
    //====================================================
    function wrapInArray(obj) {
      var array = [];
      if (!Array.isArray(obj)) {
        array = [obj];
      } else if (Array.isArray(obj)) {
        array = obj;
      }
      return array;
    }

    function base64ToFile(dataUris) {
      var byteString;
      var mimestring;
      if (dataUris.split(',')[0].indexOf('base64') !== -1) {
        byteString = $window.atob(dataUris.split(',')[1]);
      } else {
        byteString = decodeURI(dataUris.split(',')[1]);
      }
      mimestring = dataUris.split(',')[0].split(':')[1].split(';')[0];
      console.log(mimestring);
      var content = [];
      for (var i = 0; i < byteString.length; i++) {
        content[i] = byteString.charCodeAt(i);
      }
      return new $window.Blob([new $window.Uint8Array(content)], {
        type: mimestring
      });
    }
  } // End
})();