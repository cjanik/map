angular.module( 'ngBoilerplate.agm', [
  'google-maps'.ns(),
  'ui.router',
  'placeholders',
  'ui.bootstrap'
])
.config(function config( $stateProvider ) {
  $stateProvider.state( 'agm', {
    url: '/agm',
    views: {
      "main": {
        controller: 'AgmCtrl as agm',
        templateUrl: 'agm/agm.tpl.html'
      }
    },
    data:{ pageTitle: 'AGM trial' }
  });
})

.controller( 'AgmCtrl', ['$scope', '$http', '$timeout','GoogleMapApi'.ns(),
     function ($scope, $http, $timeout, GoogleMapApi) {

  var that = this;

  that.showPrograms = true;

  $scope.map = {
    control: {},
    center: {
      latitude: 15,
      longitude: -110
    },
    zoom: 3,
    events: {
      tilesloaded: function (map) {
          console.log('tilesloaded > ', map);
      }
    }
  };

  var mapCopy = {};
  angular.copy($scope.map, mapCopy);

  that.markers = [];

  that.loadNationalMarkers = function(refreshMap){
    that.markers = _.map(that.programListData, function(program){
          return {
            latitude: program.MapCenter.Latitude,
            longitude: program.MapCenter.Longitude,
            id: program.ProgramId,
            title: program.Name,
            show: false,
            onClick: function(){
              this.show = !this.show;
            },
            loadProgramKiosks: function(){
              console.log('this.id',this.id);
              that.listProgramKiosks(this.id, {latitude: this.latitude, longitude: this.longitude});
            }
          };
        });
    if(refreshMap){

      that.showPrograms = true;

      $timeout( function(){
        console.log('here', mapCopy);
        $scope.map.control.refresh(mapCopy.center);
        $scope.map.control.getGMap().setZoom(mapCopy.zoom);
      });
    }

  };

  that.listPrograms = function(){
    $http.get('assets/listPrograms.php')
      .success( function(data, status){
        that.programListData = data;
        that.showPrograms = true;
        that.loadNationalMarkers(false);
        console.log(that.markers);
      })
      .error( function(data, status){
        console.log('error:',data,'status:',status);
      });
  };

  that.listProgramKiosks = function(programId, position){
    $http.get('assets/listProgramKiosks.php', {params: {'program': programId}})
      .success( function(data, status){
        console.log('ProgramKiosks:',data);
        that.programKiosks = data;
        that.showPrograms = false;
        that.markers = _.map(data, function(kiosk){
          return {
            latitude: kiosk.Location.Latitude,
            longitude: kiosk.Location.Longitude,
            id: kiosk.Id,
            title: kiosk.Name,
            numBikes: kiosk.BikesAvailable,
            show: false,
            onClick: function(){ this.show = !this.show;}
          };
        });
        $timeout( function(){
          $scope.map.control.refresh(position);
          $scope.map.control.getGMap().setZoom(13);
        });
        
      })
      .error( function(data, status){
        console.log('error:',data,'status:',status);
      });
  };

  //that.listPrograms();



that.programListData = [
  {
    "ProgramId": 76,
    "Name": "ArborBike",
    "MapCenter": {
      "Latitude": 42.280524,
      "Longitude": -83.738929
    }
  },
  {
    "ProgramId": 72,
    "Name": "Austin B-cycle",
    "MapCenter": {
      "Latitude": 30.262477,
      "Longitude": -97.746906
    }
  },
  {
    "ProgramId": 71,
    "Name": "Battle Creek B-cycle",
    "MapCenter": {
      "Latitude": 42.321100,
      "Longitude": -85.179700
    }
  },
  {
    "ProgramId": 68,
    "Name": "Bikesantiago",
    "MapCenter": {
      "Latitude": -33.389528,
      "Longitude": -70.568018
    }
  },
  {
    "ProgramId": 54,
    "Name": "Boulder B-cycle",
    "MapCenter": {
      "Latitude": 40.020042,
      "Longitude": -105.269718
    }
  },
  {
    "ProgramId": 53,
    "Name": "Broward B-cycle",
    "MapCenter": {
      "Latitude": 26.134851,
      "Longitude": -80.167465
    }
  },
  {
    "ProgramId": 70,
    "Name": "Bublr Bikes",
    "MapCenter": {
      "Latitude": 43.037278,
      "Longitude": -87.914081
    }
  },
  {
    "ProgramId": 61,
    "Name": "Charlotte B-cycle",
    "MapCenter": {
      "Latitude": 35.226900,
      "Longitude": -80.843300
    }
  },
  {
    "ProgramId": 80,
    "Name": "Cincy Red Bike",
    "MapCenter": {
      "Latitude": 39.120027,
      "Longitude": -84.515511
    }
  },
  {
    "ProgramId": 74,
    "Name": "Columbia County B-cycle",
    "MapCenter": {
      "Latitude": 33.543376,
      "Longitude": -82.131325
    }
  },
  {
    "ProgramId": 82,
    "Name": "Dallas Fair Park",
    "MapCenter": {
      "Latitude": 32.779671,
      "Longitude": -96.759816
    }
  },
  {
    "ProgramId": 36,
    "Name": "Denver Bike Sharing",
    "MapCenter": {
      "Latitude": 39.740112,
      "Longitude": -104.984800
    }
  },
  {
    "ProgramId": 45,
    "Name": "Des Moines B-cycle",
    "MapCenter": {
      "Latitude": 41.587780,
      "Longitude": -93.625488
    }
  },
  {
    "ProgramId": 60,
    "Name": "DFC B-cycle",
    "MapCenter": {
      "Latitude": 39.718642,
      "Longitude": -105.117323
    }
  },
  {
    "ProgramId": 67,
    "Name": "Fort Worth Bike Sharing",
    "MapCenter": {
      "Latitude": 32.736028,
      "Longitude": -97.340755
    }
  },
  {
    "ProgramId": 66,
    "Name": "GREENbike",
    "MapCenter": {
      "Latitude": 40.767087,
      "Longitude": -111.891074
    }
  },
  {
    "ProgramId": 65,
    "Name": "Greenville B-cycle",
    "MapCenter": {
      "Latitude": 34.852500,
      "Longitude": -82.394200
    }
  },
  {
    "ProgramId": 47,
    "Name": "gRide",
    "MapCenter": {
      "Latitude": 37.656033,
      "Longitude": -122.392974
    }
  },
  {
    "ProgramId": 49,
    "Name": "Hawaii B-cycle",
    "MapCenter": {
      "Latitude": 21.393334,
      "Longitude": -157.740170
    }
  },
  {
    "ProgramId": 56,
    "Name": "Heartland B-cycle",
    "MapCenter": {
      "Latitude": 41.256049,
      "Longitude": -95.975748
    }
  },
  {
    "ProgramId": 59,
    "Name": "Houston B-cycle",
    "MapCenter": {
      "Latitude": 29.762887,
      "Longitude": -95.356865
    }
  },
  {
    "ProgramId": 75,
    "Name": "Indy - Pacers Bikeshare ",
    "MapCenter": {
      "Latitude": 39.770565,
      "Longitude": -86.159272
    }
  },
  {
    "ProgramId": 62,
    "Name": "Kansas City B-cycle",
    "MapCenter": {
      "Latitude": 39.071066,
      "Longitude": -94.585287
    }
  },
  {
    "ProgramId": 55,
    "Name": "Madison B-cycle",
    "MapCenter": {
      "Latitude": 43.073277,
      "Longitude": -89.401760
    }
  },
  {
    "ProgramId": 64,
    "Name": "Nashville B-cycle",
    "MapCenter": {
      "Latitude": 36.161023,
      "Longitude": -86.777244
    }
  },
  {
    "ProgramId": 79,
    "Name": "Rapid City B-cycle",
    "MapCenter": {
      "Latitude": 44.076000,
      "Longitude": -103.220000
    }
  },
  {
    "ProgramId": 48,
    "Name": "San Antonio B-cycle",
    "MapCenter": {
      "Latitude": 29.425843,
      "Longitude": -98.493633
    }
  },
  {
    "ProgramId": 73,
    "Name": "Savannah",
    "MapCenter": {
      "Latitude": 32.080902,
      "Longitude": -81.097605
    }
  },
  {
    "ProgramId": 57,
    "Name": "Spartanburg B-cycle",
    "MapCenter": {
      "Latitude": 34.946516,
      "Longitude": -81.930310
    }
  },
  {
    "ProgramId": 77,
    "Name": "Whippany NJ",
    "MapCenter": {
      "Latitude": 40.826343,
      "Longitude": -74.417204
    }
  }
];

that.loadNationalMarkers(false);

console.log(that.markers);

  GoogleMapApi.then(function(maps) {
  });
}])

.config(['GoogleMapApiProvider'.ns(), function (GoogleMapApi) {
  GoogleMapApi.configure({
    key: 'AIzaSyD2haWSEtTvBH2LubP843EhpDpf0oy0f00',
    v: '3.17',
    libraries: 'weather,geometry,visualization'
  });
}])
;