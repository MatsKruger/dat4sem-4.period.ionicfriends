// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic', 'ngCordova'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if (window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

// .config(function($stateProvider, $urlRouterProvider) {
//
//   $stateProvider
//     .state('map', {
//       url: '/',
//       templateUrl: 'templates/map.html',
//       controller: 'MapCtrl'
//     });
//
//   $urlRouterProvider.otherwise("/");
//
// })

.controller('MapCtrl', function($scope, $state, $cordovaGeolocation, $ionicModal, $http) {
  var options = {
    timeout: 10000,
    enableHighAccuracy: true
  };

  $cordovaGeolocation.getCurrentPosition(options).then(function(position) {

    var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

    var mapOptions = {
      center: latLng,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);

    //Wait until the map is loaded
    google.maps.event.addListenerOnce($scope.map, 'idle', function() {

      createMarker($scope.map, 'red', "Here I am!", latLng);

    });

    $ionicModal.fromTemplateUrl('my-modal.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modal = modal;
    });
    $scope.openModal = function() {
      $scope.modal.show();
    };
    $scope.closeModal = function() {
      $scope.modal.hide();
    };
    // Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function() {
      $scope.modal.remove();
    });
    // Execute action on hide modal
    $scope.$on('modal.hidden', function() {
      // Execute action
    });
    // Execute action on remove modal
    $scope.$on('modal.removed', function() {
      // Execute action
    });

    $scope.user = {};
    $scope.registerUser = function(user) {
      $scope.modal.hide();
      console.log("1: " + user.userName);
      console.log("2: " + user.distance);
      user.loc = {
        type: "Point",
        coordinates: []
      }; //GeoJSON point
      user.loc.coordinates.push(latLng.lng()); //Observe that longitude comes first
      user.loc.coordinates.push(latLng.lat()); //in GEoJSON
      console.log(JSON.stringify(user));
      $http({
          method: "POST",
          url: "http://nodejs-mk340.rhcloud.com/api/friends/register/" + user.distance,
          data: user
        }).then(function(response) {
          response.data.forEach(user => {
            // var marker = $scope.map.data.addGeoJson({
            //   "type": "Feature",
            //   "geometry": user.loc,
            //   "properties": user
            // });
            // console.log(marker)
            // $scope.map.data.setIcon(new google.maps.MarkerImage("http://maps.google.com/mapfiles/ms/icons/" + "yellow.png"));
            // marker.setIcon(new google.maps.MarkerImage("http://maps.google.com/mapfiles/ms/icons/" + "yellow.png"))

            createMarker($scope.map, 'yellow', user.userName, new google.maps.LatLng(user.loc.coordinates[1], user.loc.coordinates[0]));
          })
        }) //Your task is to handle the response
    }

  }, function(error) {
    console.log("Could not get location");
  });


});

function createMarker(map, markerColor, infoWindowText, latLng) {
  var marker = new google.maps.Marker({
    map: map,
    icon: new google.maps.MarkerImage("http://maps.google.com/mapfiles/ms/icons/" + markerColor + ".png"),
    animation: google.maps.Animation.DROP,
    position: latLng
  });

  var infoWindow = new google.maps.InfoWindow({
    content: infoWindowText
  });

  google.maps.event.addListener(marker, 'click', function() {
    infoWindow.open(map, marker);
  });

  return marker;
}
