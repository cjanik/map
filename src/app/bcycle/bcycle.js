angular.module( 'ngBoilerplate.bcycle', [
  'ui.router',
  'placeholders',
  'ui.bootstrap',
  'ngSanitize'
])

.config(function config( $stateProvider ) {
  $stateProvider.state( 'bcycle', {
    url: '/bcycle',
    views: {
      "main": {
        controller: 'BcycleCtrl as bcycle',
        templateUrl: 'bcycle/bcycle.tpl.html'
      }
    },
    data:{ pageTitle: 'bCycle API' }
  });
})
.factory('maploader', function($window, $q) {
   return function(){
     function loadScript() {
          var s = document.createElement('script'); // use global document since Angular's $document is weak
          s.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyD2haWSEtTvBH2LubP843EhpDpf0oy0f00&callback=initialize';
          document.body.appendChild(s);
      }
      var deferred = $q.defer();

      $window.initialize = function () {
          deferred.resolve();
      };

      if ($window.attachEvent) {  
          $window.attachEvent('onload', loadScript); 
      } else {
          $window.addEventListener('load', loadScript, false);
      }
      return deferred.promise;
  };

})
.controller( 'BcycleCtrl', function BcycleCtrl( $scope, $http, $window, $sce, maploader) {

  var that = this;

  that.program = '';
  that.programs = [];
  that.kiosks = [];
  that.showPrograms = true;

  that.loadProgram = function(position){
    var programMap;
    if (position){
      programMap = {
        zoom: 13,
        center: position
      };
    } else {
      programMap = {
        zoom: 13,
        center: {lat: 43.07572, lng: -89.38528}
      };
    }
    
    that.gMap = new google.maps.Map( document.getElementById('map-canvas'), programMap);
    var infoWindow = new google.maps.InfoWindow({});

    angular.forEach(that.kiosks, function(kiosk){

      var marker = new google.maps.Marker({
              map: that.gMap,
              position: {lat: kiosk.Location.Latitude, lng: kiosk.Location.Longitude},
              title: kiosk.Id.toString()
          });

      google.maps.event.addListener(marker, 'click', function(){
        infoWindow.setContent('<h3>' + marker.title + '</h3><div id="click">' + kiosk.Name + '</div>');

        infoWindow.open(that.gMap, marker);
      });

      google.maps.event.addListener(that.gMap, 'click', function() {
        infoWindow.close();
      });


    });
  };

  that.setMarkers = function(){

    if($window.google && $window.google.maps){

      $scope.markers = [];

      var infoWindow = new google.maps.InfoWindow({});
      
      var createMarker = function (info){
          
          var marker = new google.maps.Marker({
              map: that.gMap,
              position: {lat: info.MapCenter.Latitude, lng: info.MapCenter.Longitude},
              title: info.ProgramId.toString()
          });

          console.log('mapCenter', info.MapCenter, 'marker', marker.getTitle(), 'name', info.Name);
          
          
          google.maps.event.addListener(marker, 'click', function(){
            infoWindow.setContent('<h3>' + marker.title + 
              '</h3><button ng-click="bcycle.init('+info.ProgramId+', ' + marker.position + ')">' + info.Name + '</button>');
            infoWindow.open(that.gMap, marker);
          });

          google.maps.event.addListener(that.gMap, 'click', function() {
            infoWindow.close();
          });
          
          $scope.markers.push(marker);
          
      };  
      
      for (var i = 0; i < that.programs.length; i++){
          createMarker(that.programs[i]);
      }
    } else {
      setTimeout(that.setMarkers, 1000);
    }
};

  that.init = function(programId, position){
    console.log('program: ',programId);
    $http.get('assets/api-proxy.php', {params: {'kiosk': programId}})
    .success( function(data, status){
      console.log(data);
      if(programId !== ''){
        that.kiosks = data;
        that.showPrograms = false;
        console.log('why am i here');
        that.loadProgram(position);

      } else {
        that.programs = data;
        that.setMarkers();
      }
      that.program = programId;
    });
  };
  // set default map
  var mapOptions = {
      zoom: 4,
      center: {lat: 37, lng: -92}
  };

  that.init('');

  that.trustMe = function(snippet){
    return $sce.trustAsHtml(snippet);
  };


//when the api is loaded, create a new maps instance

  if ($window.google && $window.google.maps) {
    console.log('gmaps already loaded');
    that.gMap = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
  } else {
    maploader().then(function () {
        console.log('promise resolved');
        if ($window.google && $window.google.maps) {
            console.log('gmaps loaded');
            that.gMap = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
        } else {
            console.log('gmaps not loaded');
        }
    }, function () {
        console.log('promise rejected');
    });
  }


})


;
