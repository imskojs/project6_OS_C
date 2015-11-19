(function() {
  'use strict';

  angular.module('app')
    .directive('daumMap', daumMap);

  // Products or Posts
  daumMap.$inject = ['DaumMapModel', 'Places', 'Bookings', 'Products', '$state', '$cordovaGeolocation', '$geolocation', 'Message', '$q', '$stateParams', 'daum', 'appStorage'];

  function daumMap(DaumMapModel, Places, Bookings, Products, $state, $cordovaGeolocation, $geolocation, Message, $q, $stateParams, daum, appStorage) {
    return {
      scope: {
        markerSrc: '@',
        markerClickedSrc: '@',
        markerWidth: '@',
        markerHeight: '@',
      },
      compile: function(element) {
        //==========================================================================
        //              Global Map Property
        //==========================================================================
        var latitude = appStorage.geoJSON.coordinates[1] || DaumMapModel.currentPosition.latitude || 37.498085435791786;
        var longitude = appStorage.geoJSON.coordinates[0] || DaumMapModel.currentPosition.longitude || 127.02800027507125;
        var DOM = element[0];
        var mapOptions = {
          center: new daum.maps.LatLng(latitude, longitude),
          level: 4,
          draggable: true
        };
        daum.maps.disableHD();
        var map = new daum.maps.Map(DOM, mapOptions);
        var ps = new daum.maps.services.Places();
        var geocoder = new daum.maps.services.Geocoder();

        //====================================================
        //  Functions Exposed to controller via DaumMapModel
        //====================================================
        DaumMapModel.findMeThenSearchNearBy = findMeThenSearchNearBy;
        DaumMapModel.searchLocationNearBy = searchLocationNearBy;
        DaumMapModel.pinSelectedPlace = pinSelectedPlace;
        DaumMapModel.unPinSelectedPlace = unPinSelectedPlace;
        DaumMapModel.marker = null;
        DaumMapModel.placeIdMarker = null;

        //====================================================
        //  Link Function
        //====================================================
        return function link(scope) {
          // Marker style properties.
          var markerSize = new daum.maps.Size(Number(scope.markerWidth), Number(scope.markerHeight));
          var markerImg = new daum.maps.MarkerImage(scope.markerSrc, markerSize);
          map.relayout();
          DaumMapModel.domMap = map;
          daum.maps.event.addListener(map, 'click', function(mouseEvent) {
            geocoder.coord2addr(mouseEvent.latLng, function(status, result) {
              appStorage.address = result[0].fullName;
            });
            if (DaumMapModel.marker) {
              DaumMapModel.marker.setMap(null);
            }
            DaumMapModel.marker = new daum.maps.Marker({
              position: mouseEvent.latLng,
              image: markerImg
            });
            DaumMapModel.marker.setMap(map);
            DaumMapModel.marker.setDraggable(true);
            DaumMapModel.currentPosition = {
              latitude: mouseEvent.latLng.getLat(),
              longitude: mouseEvent.latLng.getLng()
            };
          });
        }; // link end

        //====================================================
        //  Helper
        //====================================================
        function findMeThenSearchNearBy() {
          Message.loading();
          $cordovaGeolocation.getCurrentPosition({
            maximumAge: 10000,
            timeout: 5000
          })
            .then(function success(position) {
              Message.hide();
              if (position.coords == null) {
                Message.alert(
                  '위치 공유가 꺼져있습니다.',
                  '위치 공유를 켜주세요.'
                );
                return false;
              }
              DaumMapModel.currentPosition = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
              };
              map.setCenter(new daum.maps.LatLng(
                DaumMapModel.currentPosition.latitude,
                DaumMapModel.currentPosition.longitude
              ));
              console.log("---------- DaumMapModel.currentPosition ----------");
              console.log(DaumMapModel.currentPosition);
              console.log("HAS TYPE: " + typeof DaumMapModel.currentPosition);
              console.log("---------- CONSOLE END -------------------");
            })
            .catch(function error(err) {
              console.log(err);
              return Message.alert(
                '위치 공유가 꺼져있습니다.',
                '위치 공유를 켜주세요.'
              );
            })
            .finally(function() {
              return Message.hide();
            });
        }

        function searchLocationNearBy(value) {
          Message.loading();
          if (!value) {
            Message.hide();
            Message.alert('검색하기 알림', '장소 값을 넣어서 다시 검색해주세요');
            return false;
          }
          ps.keywordSearch(value, function success(status, data) {
            if (data.places[0] === undefined) {
              Message.hide();
              Message.alert(
                '요청하신 장소가 없습니다',
                '다시검색해주세요'
              );
              return false;
            }
            map.panTo(new daum.maps.LatLng(
              data.places[0].latitude,
              data.places[0].longitude
            ));
            DaumMapModel.currentPosition = {
              latitude: data.places[0].latitude,
              longitude: data.places[0].longitude
            };
            Message.hide();
          }, function erro(err) {
            console.log(err);
            Message.hide();
            Message.alert({
              title: '위치 공유가 꺼져있습니다.',
              template: '위치 공유 켜주세요.'
            });
          });
        }


        function pinSelectedPlace() {
          var longitude = DaumMapModel.selectedPlace.longitude;
          var latitude = DaumMapModel.selectedPlace.latitude;
          DaumMapModel.placeIdMarker = new daum.maps.Marker({
            position: new daum.maps.LatLng(latitude, longitude)
          });
          DaumMapModel.placeIdMarker.setMap(map);
          map.panTo(new daum.maps.LatLng(latitude, longitude));
        }

        function unPinSelectedPlace() {
          DaumMapModel.placeIdMarker.setMap(null);
        }






        //====================================================
        //  IMPLEMENTATIONS COMPILE
        //====================================================
        // Draw Markers after query
        // var drawMarkers = function(currentCenter, markerImg, markerClickedImg, scope) {
        //   resetMarkers();
        //   requestPlacesWithin(currentCenter)
        //     .then(processPin.bind(null, markerImg, markerClickedImg, scope))
        //     .catch(function error(err) {
        //       Message.hide();
        //       Message.alert();
        //       console.log(err);
        //     });
        // };
        //====================================================
        //  HELPER
        //====================================================
        // function resetMarkers() {
        //   angular.forEach(DaumMapModel.markers, function(marker) {
        //     marker.setMap(null);
        //   });
        //   DaumMapModel.markers = [];
        // }

        // function requestPlacesWithin(currentCenter) {
        //   // Request server for places;
        //   var PlacesPromise = {};
        //   if ($stateParams.id) {
        //     PlacesPromise = Products.findById({
        //       id: $stateParams.id,
        //       populates: 'photos'
        //     }).$promise;
        //   } else {
        //     PlacesPromise = Products.getProductWithin({
        //       type: 'local',
        //       latitude: currentCenter.latitude,
        //       longitude: currentCenter.longitude,
        //       distance: currentCenter.distance || 5000,
        //       limit: currentCenter.limit || 50,
        //     }).$promise;
        //   }
        //   return PlacesPromise;
        // }

        // function processPin(markerImg, markerClickedImg, scope, placesWrapper) {
        //   if ($stateParams.id) {
        //     DaumMapModel.places = [placesWrapper];
        //   } else {
        //     DaumMapModel.places = placesWrapper.products;
        //   }
        //   angular.forEach(DaumMapModel.places, function(place, i) {
        //     //place = {location:{type:'Point', coordinates:[126.10101, 27.101010]}, ...}
        //     var placeLongitude = place.geoJSON.coordinates[0];
        //     var placeLatitude = place.geoJSON.coordinates[1];
        //     // set marker
        //     var position = new daum.maps.LatLng(placeLatitude, placeLongitude);
        //     var marker = new daum.maps.Marker({
        //       map: map,
        //       position: position,
        //       // used as to link to place info
        //       title: String(i),
        //       image: markerImg,
        //       clickable: true
        //     });
        //     daum.maps.event.addListener(marker, 'click', function() {
        //       var marker = this;
        //       scope.$apply(function() {
        //         // on click: differentiate clicked image;
        //         angular.forEach(DaumMapModel.markers, function(otherMarker) {
        //           otherMarker.setImage(markerImg);
        //         });
        //         marker.setImage(markerClickedImg);
        //         // on click: show modal which will be filled with place info
        //         // modal references DaumMapModel.selectedPlace to fill in the info
        //         var index = Number(marker.getTitle());
        //         Message.loading();
        //         Products.findById({
        //           id: DaumMapModel.places[index].id,
        //           populates: 'photos,createdBy'
        //         }).$promise
        //           .then(function success(data) {
        //             Message.hide();
        //             DaumMapModel.selectedPlace = data;
        //             console.log(data);
        //             DaumMapModel.modal.show();
        //           }, function error(err) {
        //             console.log(err);
        //             Message.hide();
        //             Message.alert();
        //           });
        //         // DaumMapModel.selectedPlace = DaumMapModel.places[index];
        //       });
        //     });
        //     // Save converted place with click event added.
        //     DaumMapModel.markers.push(marker);
        //   });
        //   Message.hide();
        // }





      } // compile end
    }; //  returning an object end

  } // factory function end
})();
