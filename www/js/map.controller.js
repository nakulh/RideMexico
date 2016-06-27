var app = angular.module('Map.controllers', ['Map.services']);
app.controller('MapController', function($scope, MapService, NgMap, $ionicTabsDelegate){
  NgMap.getMap().then(function(map) {
    $scope.shapes = [];
    $scope.markers = [];
    $scope.colours = ["#ff0000", "#66ff33", "#996633", "#cc00ff", "#660066", "#999966", "#ff6699",
                       "#003366", "#3366cc", "#660033", "#0099cc", "#669999", "#00ccff", "#666699",
                       "#00ffff", "#6600ff", "#66ffff", "#339933", "#ccffff", "#ffffcc", "#669900",
                       "#993333", "#ff0000", "#66ff33", "#996633", "#cc00ff", "#660066", "#999966",
                       "#ff6699", "#003366","#3366cc", "#660033", "#0099cc", "#669999", "#00ccff",
                       "#666699", "#00ffff", "#6600ff", "#66ffff", "#339933", "#ccffff", "#ffffcc",
                       "#669900", "#993333", "#ff0000", "#66ff33", "#996633", "#cc00ff", "#660066",
                       "#999966", "#ff6699", "#003366","#3366cc", "#660033", "#0099cc", "#669999",
                       "#00ccff", "#666699", "#00ffff", "#6600ff", "#66ffff", "#339933", "#ccffff",
                       "#ffffcc", "#669900", "#993333"];
    console.log(map.getCenter().toUrlValue());
  //  console.log('markers', map.markers);
  //  console.log('shapes', map.shapes);

    $scope.selectLocation = function(){
      latLon = map.getCenter().toUrlValue();
      console.log(latLon);
      lat = latLon.slice(0,latLon.indexOf(","));
      lon = latLon.slice(latLon.indexOf(",")+1, latLon.length);
      console.log(lat);
      console.log(lon);
      dist = 400;
      MapService.getRoutes(lat, lon, dist).then(function(data){
        if(!data){
          console.log("no stops found");
        }
        else{
          $scope.shapes = [];
          $scope.markers = [];
          for(x = 0; x < MapService.shapes.length; x++){
            $scope.shapes.push("");
            for(y = 0; y < MapService.shapes[x].length; y++){
              $scope.shapes[x] += "[" + MapService.shapes[x][y].shape_pt_lat + "," + MapService.shapes[x][y].shape_pt_lon + "],";
            }
            $scope.shapes[x] = "[" + $scope.shapes[x].slice(0, -1) + "]";
          }
          //console.log(MapService.trips.length);
          for(x = 0; x < $scope.shapes.length; x++)
            console.log($scope.shapes[x]);
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
