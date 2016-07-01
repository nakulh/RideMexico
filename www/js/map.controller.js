var app = angular.module('Map.controllers', ['Map.services']);
app.controller('MapController', function($scope, MapService, NgMap, $ionicTabsDelegate, $cordovaToast, $http){
  NgMap.getMap().then(function(map) {
    $scope.dist = 100;
    $scope.Dist = $scope.dist;
    $scope.shapes = [];
    $scope.markers = [];
    $scope.circles = [];
    $scope.tripType = [];
    $scope.address = "";
    $scope.markerAnimation = false;
    $scope.gotNewAddress = false;
    $scope.img = "dyMap.png";
    $scope.bus = true;
    $scope.train = true;
    $scope.metro = true;
    $scope.crtstn = false;
    $scope.colours = ["#207371", "#875560", "#cd582f", "#f91f5f", "#496095", "#3be701", "#021240",
                       "#9a950e", "#98e388", "#ff0000", "#e8afc4"];
    var tripTypeDir = {
      "1": "metro",
      "2": "train",
      "3": "bus"
    };
    var shuffleColours = function shuffleArray(array) {
        for (var i = array.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
        return array;
    };
    $scope.distSet = function(x){
      $scope.dist = x;
    };
    $scope.busChange = function(){
      $scope.bus = !$scope.bus;
    };
    $scope.trainChange = function(){
      $scope.train = !$scope.train;
    };
    $scope.metroChange = function(){
      $scope.metro = !$scope.metro;
    };
    $scope.crtstnChange = function(){
      $scope.crtstn = !$scope.crtstn;
    };
    google.maps.event.addListener(map, 'center_changed', function() {
      $scope.img = "dyMap.png";
      $scope.gotNewAddress = false;
      $scope.$apply();
    });
    $scope.clearMap = function(){
      $scope.shapes = [];
      $scope.markers = [];
      $scope.circles = [];
      $scope.address = "";
      $scope.markerAnimation = false;
      $scope.img = "dyMap.png";
      $scope.gotNewAddress = false;
    };
    $scope.selectLocation = function(){
      $scope.img = "dyMapBusy.png";
      $scope.markerAnimation = true;
      latLon = map.getCenter().toUrlValue();
      lat = latLon.slice(0,latLon.indexOf(","));
      lon = latLon.slice(latLon.indexOf(",")+1, latLon.length);
      $http.get("https://maps.googleapis.com/maps/api/geocode/json?latlng=" + lat + "," + lon + "&key=AIzaSyDtZm_v8XKJd4VOqMdonzpM02t0zweJS3E")
        .success(function(geoData){
          if(geoData.results[1].formatted_address.length > 34)
            $scope.address = geoData.results[1].formatted_address.slice(0, 34) + "..";
          else {
            $scope.address = geoData.results[1].formatted_address;
          }
          $scope.gotNewAddress = true;
        })
        .error(function(err){
          console.log(err);
        });
      MapService.getRoutes(lat, lon, $scope.dist, $scope.bus, $scope.train, $scope.metro).then(function(data){
        if(!data){
          /*$cordovaToast
            .show('No stops nearby', 'long', 'center')
            .then(function(success) {
            }, function (error) {
            });*/
          $scope.markerAnimation = false;
        }
        else{
          var start = $scope.shapes.length;
          $scope.colours = shuffleColours($scope.colours);
          for(x = start; x < MapService.shapes.length + start; x++){
            $scope.shapes.push("");
            //var secondStart = start > 0 ? x-start:x;
            for(y = 0; y < MapService.shapes[x-start].length; y++){
              $scope.shapes[x] += "[" + MapService.shapes[x-start][y].shape_pt_lat + "," + MapService.shapes[x-start][y].shape_pt_lon + "],";
            }
            $scope.shapes[x] = "[" + $scope.shapes[x].slice(0, -1) + "]";
          }
          for(x = 0; x < MapService.tripType.length; x++){
            $scope.tripType.push(tripTypeDir[MapService.tripType[x]]);
          }
          for(x = 0; x < MapService.stops.length; x++){
            for(y = 0; y < MapService.stops[x].length; y++){
              console.log(x + "," + y);
              var iconMark = "./img/" + $scope.tripType[x] + "/" + $scope.colours[x].slice(1, 7) + ".png";
              var mark = new google.maps.Marker({
                position: {lat: MapService.stops[x][y].stop_lat, lng: MapService.stops[x][y].stop_lon},
                map: map,
                icon: iconMark
              });
              console.log(mark);
              $scope.markers.push(mark);
            }
          }
          var circleCenter = "[" + lat + "," + lon + "]";
          $scope.circles.push({
            center: circleCenter,
            radius: $scope.dist
          });
          $scope.markerAnimation = false;
          $scope.img = "dyMap.png";
        }
      }, function(err){
        console.log(err);
      });
    };

  });


  $scope.status = true;
  $scope.shower = function(){
    $scope.status = true;
    console.log("show");
  };
  $scope.hider = function () {
    $scope.status = false;
    console.log("hide");
  };
});
