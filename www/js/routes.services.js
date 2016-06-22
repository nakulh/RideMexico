var app = angular.module('routes.services',[]);

//Returns js/routes.json file
app.factory('RoutesService', function($http, $q){
    var self = {};
    self.loadRoutes = function(){
        var d = $q.defer();
        $http.get("./js/routes.json")
          .success(function success(data){
            d.resolve(data);
          })
          .error(function error(err){
            console.log(err);
          });
        return d.promise;
    };
    return self;
});

//gets 1 metro route details
app.factory('MetroRouteService', function($http, $q){
  var self = {};
  self.getRouteDetails = function(routeId){
    self.route = {};
    self.trips = [];
    self.tripsUnique = [];
    self.frequencies = [];
    self.frequenciesUnique = [];
    self.stopTimes = [];
    self.stops = [];
    self.routeTime = "";
    self.shapes = [];
    var d = $q.defer();
    $http.get("./js/routes.json")
      .success(function success(routes){
        var x = 0;
        for(x; x< routes.length; x++){
          if(routes[x].route_id == routeId){
            self.route = routes[x];
            break;
          }
        }
        $http.get("./js/trips.json")
          .success(function success(trips){
            for(x = 0; x < trips.length; x++){
              if(trips[x].route_id == routeId){
                found = false;
                self.trips.push(trips[x]);
                for(y = 0; y < self.tripsUnique.length; y++){
                  if(self.tripsUnique[y].service_id == trips[x].service_id){
                    found = true;
                  }
                }
                if(!found){
                  self.tripsUnique.push(trips[x]);
                }
              }
            }
            $http.get("./js/frequencies.json")
              .success(function success(frequencies){
                for(x = 0; x < frequencies.length; x++){
                  var found = false;
                  for(y = 0; y < self.trips.length; y++){
                    if(frequencies[x].trip_id == self.trips[y].trip_id){
                      self.frequencies.push(frequencies[x]);
                    }
                  }
                }
              })
              .error(function error(err){
                console.log(err);
              });
            $http.get("./js/stop_times.json")
              .success(function success(stop_times){
                for(x = 0; x < stop_times.length; x++)
                  if(stop_times[x].trip_id == self.trips[0].trip_id)
                    self.stopTimes.push(stop_times[x]);
                l = self.stopTimes.length - 1;
                self.routeTime = self.stopTimes[l].arrival_time;
                $http.get("./js/stops.json")
                  .success(function success(stops){
                    for(x = 0; x < self.stopTimes.length; x++)
                      for(y = 0; y < stops.length; y++)
                        if(self.stopTimes[x].stop_id.trim() == stops[y].stop_id.trim())
                          self.stops.push(stops[y]);
                    d.resolve(true);
                  })
                  .error(function error(err){
                    console.log(err);
                  });
              })
              .error(function error(err){
                console.log(err);
              });
            $http.get("./js/shapes.json")
              .success(function success(shapes){
                for(x = 0; x < shapes.length; x++)
                  if(shapes[x].shape_id == self.trips[0].shape_id)
                    self.shapes.push(shapes[x]);
              })
              .error(function error(err){
                console.log(err);
              });
          })
          .error(function error(err){
            console.log(err);
          });
      })
      .error(function error(err){
        console.log(err);
      });
    return d.promise;
  };
  return self;
});
