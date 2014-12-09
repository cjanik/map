angular.module('ngBoilerplate.agm', [
        'google-maps'.ns(),
        'ui.router',
        'placeholders',
        'ui.bootstrap'
    ])
    .config(function config($stateProvider) {
        $stateProvider.state('agm', {
            url: '/agm',
            views: {
                "main": {
                    controller: 'AgmCtrl as agm',
                    templateUrl: 'agm/agm.tpl.html'
                }
            },
            data: {
                pageTitle: 'bCycle Map'
            }
        });
    })

.service('bCycleService', ['$http', function($http) {
    // API polling with revealing module pattern

    var listPrograms = function() {
        var programPromise = $http.get('assets/listPrograms.php');
        return programPromise;
    };

    var listProgramKiosks = function(programId) {
        var kioskPromise = $http.get('assets/listProgramKiosks.php', {
            params: {
                'program': programId
            }
        });
        return kioskPromise;
    };

    return {
        listPrograms: listPrograms,
        listProgramKiosks: listProgramKiosks
    };

}])

.controller('AgmCtrl', ['$scope', '$timeout', 'GoogleMapApi'.ns(), 'bCycleService',
    function($scope, $timeout, GoogleMapApi, bCycleService) {

        var that = this;

        this.loading = true;
        this.showPrograms = true;
        this.markers = [];

        this.updateSidebar = function(){

        };

        this.loadCity = function(id) {
          bCycleService.listProgramKiosks(id).success(function(data, status) {
                  console.log('ProgramKiosks:', data);
                  that.showPrograms = false;
                  that.loading = false;
                  that.kiosks = data;
                  that.markers = _.map(data, function(kiosk) {
                      return {
                          latitude: kiosk.Location.Latitude,
                          longitude: kiosk.Location.Longitude,
                          id: kiosk.Id,
                          title: kiosk.Name,
                          numBikes: kiosk.BikesAvailable,
                          show: false,
                          onClick: function() {
                              this.show = !this.show;
                          },
                          getDetail: function(){
                            that.updateSidebar();
                          }
                      };
                  });


              })
              .error(function(data, status) {
                  console.log('error:', data, 'status:', status);
              });
        };

        this.init = function(){
            that.cityProgram = false;
            bCycleService.listPrograms().success(function(data, status) {
                console.log('first', data);
                that.showPrograms = true;
                that.loading = false;
                that.markers = _.map(data, function(program) {
                    return {
                        latitude: program.MapCenter.Latitude,
                        longitude: program.MapCenter.Longitude,
                        id: program.ProgramId,
                        title: program.Name,
                        show: $scope.windowOptions.visible,
                        onClick: function() {
                            $scope.windowOptions.visible = true;
                            that.cityProgram = program;
                        },
                        getDetail: function() {
                            console.log('this.id', this.id);
                            that.loadCity(this.id);
                            that.loading = true;
                            $scope.refreshMap({
                                latitude: this.latitude,
                                longitude: this.longitude
                            }, 13);
                        }
                    };
                });
            });
        };

        $scope.map = {
            control: {},
            center: {
                latitude: 15,
                longitude: -105
            },
            zoom: 3,
            events: {
                tilesloaded: function(map) {
                    console.log('tilesloaded > ', map);
                },
                click: function(map) {
                    $scope.windowOptions.visible = false;
                }
            }
        };

        $scope.windowOptions = {
            visible: false
        };


        var mapCopy = {};
        angular.copy($scope.map, mapCopy);

        $scope.refreshMap = function(position, zoom) {
            position = position || mapCopy.center;
            zoom = zoom || mapCopy.zoom;
            $timeout(function() {
                $scope.map.control.refresh(position);
                $scope.map.control.getGMap().setZoom(zoom);
            });

        };

        this.init();

        console.log(that.markers);

        // GoogleMapApi.then(function(maps) {
        // });
    }
])

.config(['GoogleMapApiProvider'.ns(), function(GoogleMapApi) {
    GoogleMapApi.configure({
        key: 'AIzaSyD2haWSEtTvBH2LubP843EhpDpf0oy0f00',
        v: '3.17',
        libraries: 'weather,geometry,visualization'
    });
}]);