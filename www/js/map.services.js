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
  self.getRoutes = function(lat, lon, dist, bus, train, metro){
    d = $q.defer();
    self.stopIds = [];
    self.tripIds =  [];
    self.tripIdsC = [];
    self.tripIdsD = [];
    self.trips  = [];
    self.stopTimes = [];
    self.stops = [];
    self.shapes = [];
    self.routes = [];
    self.tripsNoRepeat = [];
    self.tripType = [];
    $http.get("./js/stops.json")
    //select stops within range
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
        //console.log(self.stopIds);
        //get matching tripId in stop__times.json from stop ids
        $http.get("./js/stop_times.json")
          .success(function(stopTimes){
            angular.forEach(stopTimes, function(stopTime, index){
              for(x = 0; x < self.stopIds.length; x++)
                if(self.stopIds[x].trim() == stopTime.stop_id.trim())
                  self.tripIds.push(stopTime.trip_id);
            });
            //remove duplicate tripIds by comparing trip_desc in trips.json
          //console.log(self.tripIds);
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
                    //console.log(self.tripIds[x]);
                  }
                }
                $http.get('./js/routes.json')
                  .success(function(routes){
                    var selRoutes = {};
                    for(x = 0; x < self.trips.length; x++)
                      for(y = 0; y < routes.length; y++)
                        if(routes[y].route_id.trim() == self.trips[x].route_id){
                          if(routes[y].route_type == "1" && metro || routes[y].route_type == "2" && train || routes[y].route_type == "3" && bus || routes[y].route_type == "800"){
                            var id  = routes[y].route_id;
                            if(!selRoutes[id]){
                              self.tripIdsD.push(self.trips[x].trip_id);
                              self.routes.push(routes[y]);
                              self.tripsNoRepeat.push(self.trips[x]);
                              self.tripType.push(routes[x].route_type);
                              selRoutes[id] = true;
                            }
                          }
                        }
                        //console.log(self.tripIdsD.length);
                        //get corresponding stop_times for getting stops

                        for(x = 0; x < self.tripIdsD.length; x++){
                          self.stopTimes.push([]);
                          for(y = 0; y < stopTimes.length; y++)
                            if(self.tripIdsD[x] == stopTimes[y].trip_id)
                              self.stopTimes[x].push(stopTimes[y]);
                        }
                        //now get the stops
                        for(x = 0; x < self.stopTimes.length; x++){
                          self.stops.push([]);
                          for(y = 0; y < self.stopTimes[x].length; y++)
                            for(z = 0; z < stops.length; z++)
                              if(stops[z].stop_id.trim() == self.stopTimes[x][y].stop_id)
                                self.stops[x].push(stops[z]);
                        }
                        //get paths from trips objects
                        $http.get("./js/shapes.json")
                          .success(function success(shapes){
                            for(x = 0; x < self.tripsNoRepeat.length; x++){
                              self.shapes.push([]);
                              for(y = 0; y < shapes.length; y++)
                                if(shapes[y].shape_id == self.tripsNoRepeat[x].shape_id)
                                  self.shapes[x].push(shapes[y]);
                            }
                            d.resolve(true);
                          })
                          .error(function error(err){
                            console.log(err);
                          });
                  })
                  .error(function(err){
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
