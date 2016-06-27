var app = angular.module('Map.services',[]);

app.factory('MapService', function($http, $q){
  self = {};
  self.distance = function (lat1, lon1, lat2, lon2) {
    var p = 0.017453292519943295;    // Math.PI / 180
    var c = Math.cos;
    var a = 0.5 - c((lat2 - lat1) * p)/2 +
            c(lat1 * p) * c(lat2 * p) *
            (1 - c((lon2 - lon1) * p))/2;

    return 12742 * Math.asin(Math.sqrt(a)) * 1000; // 2 * R; R = 6371 km
  };
  self.getRoutes = function(lat, lon, dist){
    d = $q.defer();
    self.stopIds = [];
    self.tripIds =  [];
    self.tripIdsC = [];
    self.trips  = [];
    self.stopTimes = [];
    self.stops = [];
    self.shapes = [];
    $http.get("./js/stops.json")
      .success(function (stops){
        angular.forEach(stops, function(stop, index){
          var currDist = self.distance(lat, lon, stop.stop_lat, stop.stop_lon);
          if(currDist <= dist){
            self.stopIds.push(stop.stop_id);
          }
        });
        if(self.stopIds.length === 0){
          d.resolve(false);
          return d.promise;
        }
        console.log(self.stopIds);
        $http.get("./js/stop_times.json")
          .success(function(stopTimes){
            angular.forEach(stopTimes, function(stopTime, index){
              for(x = 0; x < self.stopIds.length; x++)
                if(self.stopIds[x].trim() == stopTime.stop_id.trim())
                  self.tripIds.push(stopTime.trip_id);
            });
            console.log(self.tripIds);
            $http.get('./js/trips.json')
              .success(function(trips){
                var selTrips = {};
                for(x = 0; x < trips.length; x++)
                  for(y = 0; y < self.tripIds.length; y++)
                    if(trips[x].trip_id == self.tripIds[y]){
                      var id = trips[x].trip_id;
                      selTrips[id] = trips[x];
                    }
                self.tripIdsC.push(self.tripIds[0]);
                self.trips.push(selTrips[self.tripIds[0]]);
                for(x = 0; x < self.tripIds.length; x++){
                  var there = false;
                  for(y = 0; y < self.tripIdsC.length; y++){
                      if(selTrips[self.tripIdsC[y]].trip_desc.trim() == selTrips[self.tripIds[x]].trip_desc.trim())
                        there = true;
                  }
                  if(!there){
                    self.tripIdsC.push(self.tripIds[x]);
                    self.trips.push(selTrips[self.tripIds[x]]);
                    console.log(self.tripIds[x]);
                  }
                }
                console.log(self.tripIdsC.length);
                for(x = 0; x < self.tripIdsC.length; x++){
                  self.stopTimes.push([]);
                  for(y = 0; y < stopTimes.length; y++)
                    if(self.tripIdsC == stopTimes[y].trip_id)
                      self.stopTimes[x].push(stopTimes[y]);
                }
                for(x = 0; x < self.stopTimes.length; x++){
                  self.stops.push([]);
                  for(y = 0; y < self.stopTimes[x].length; y++)
                    for(z = 0; z < stops.length; z++)
                      if(stops[z].stop_id.trim() == self.stopTimes[x][y].stop_id)
                        self.stops[x].push(stops[z]);
                }
                $http.get("./js/shapes.json")
                  .success(function success(shapes){
                    for(x = 0; x < self.trips.length; x++){
                      self.shapes.push([]);
                      for(y = 0; y < shapes.length; y++)
                        if(shapes[y].shape_id == self.trips[x].shape_id)
                          self.shapes[x].push(shapes[y]);
                    }
                    d.resolve(true);
                  })
                  .error(function error(err){
                    console.log(err);
                  });
              })
              .error(function (err){
                console.log(err);
              });
          })
          .error(function (err){
            console.log(err);
          });
      }).error(function (err) {
          console.log(err);
        });
    return d.promise;
  };
  return self;
});
