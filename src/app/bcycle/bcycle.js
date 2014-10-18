angular.module( 'ngBoilerplate.bcycle', [
  'ui.router',
  'placeholders',
  'ui.bootstrap'
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

.controller( 'BcycleCtrl', function BcycleCtrl( $scope, $http, $window) {

  var that = this;

  that.program = '';

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


  that.init = function(){
    console.log('kiosk: ',that.program);
    $http.get('assets/api-proxy.php', {params: {'kiosk': that.program}})
    .success( function(data, status){
      console.log(data);
      if(that.program !== ''){
        that.kiosks = data;
        that.programs = [];
      } else {
        that.programs = data;
      }
      that.program = '';
    });
  };

that.init();

})

;
