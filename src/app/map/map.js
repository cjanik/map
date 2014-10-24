angular.module( 'ngBoilerplate.map', [
  'ui.router',
  'placeholders',
  'ui.bootstrap'
])

.config(function config( $stateProvider ) {
  $stateProvider.state( 'map', {
    url: '/map',
    views: {
      "main": {
        controller: 'MapCtrl as map',
        templateUrl: 'map/map.tpl.html'
      }
    },
    data:{ pageTitle: 'Google Maps API' }
  });
})

.controller( 'MapCtrl', function MapCtrl( $scope, $http, $window) {

  var that = this;

    that.setMarkers = function(){

      if($window.google && $window.google.maps){

        $scope.markers = [];
    
        var infoWindow = new google.maps.InfoWindow({});
        
        var createMarker = function (info){
            
          var marker = new google.maps.Marker({
              map: $scope.gMap,
              position: new google.maps.LatLng(info.point.coordinates[1], info.point.coordinates[0]),
              title: info.id.toString()
          });
          
          google.maps.event.addListener(marker, 'click', function(){
            infoWindow.setContent('<h2>' + marker.title + '</h2><div class="infoWindowContent">' + info.name + '</div>');
            infoWindow.open($scope.gMap, marker);
          });

          google.maps.event.addListener($scope.gMap, 'click', function() {
            infoWindow.close();
          });
          
          $scope.markers.push(marker);
            
        };  
        
        for (var i = 0; i < that.bikeStations.length; i++){
            createMarker(that.bikeStations[i]);
        }
      } else {
        setTimeout(that.setMarkers, 1000);
      }
    };

  $http.get("http://hubwaydatachallenge.org/api/v1/station/", 
    { params:
        {
            "format": "json",
            "username": "cjanik",
            "api_key": "74a991b36d48fb876f68bb0e10d89bc800262eb2"
        } })
    .success( function(data, status){
      that.bikeStations = data.objects;
      that.setMarkers();
      console.log('success status: ',status,' data: ',data.objects);
    })
    .error( function(data, status){
      console.log('error status: ',status,' data: ',data);
    });
})
// asynchronously load the google maps api
.directive('loadMap', ['$window', '$q', function ($window, $q) {
    function load_script() {
        var s = document.createElement('script'); // use global document since Angular's $document is weak
        s.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyD2haWSEtTvBH2LubP843EhpDpf0oy0f00&callback=initialize';
        document.body.appendChild(s);
    }
    function lazyLoadApi(key) {
        var deferred = $q.defer();
        $window.initialize = function () {
            deferred.resolve();
        };
        // thanks to Emil Stenström: http://friendlybit.com/js/lazy-loading-asyncronous-javascript/
        if ($window.attachEvent) {  
            $window.attachEvent('onload', load_script); 
        } else {
            $window.addEventListener('load', load_script, false);
        }
        return deferred.promise;
    }
    return {
        restrict: 'E',
        link: function ($scope, element, attrs) { // function content is optional
        // in this example, it shows how and when the promises are resolved
            var mapOptions = {
                    zoom: 11,
                    center: {lat: 42.340021, lng: -71.100812}
                };

            //when the api is loaded, create a new maps instance

            if ($window.google && $window.google.maps) {
                console.log('gmaps already loaded');
                $scope.gMap = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
            } else {
                lazyLoadApi().then(function () {
                    console.log('promise resolved');
                    if ($window.google && $window.google.maps) {
                        console.log('gmaps loaded');
                        
                        $scope.gMap = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
                    } else {
                        console.log('gmaps not loaded');
                    }
                }, function () {
                    console.log('promise rejected');
                });
            }
        }
    };
}])


;
