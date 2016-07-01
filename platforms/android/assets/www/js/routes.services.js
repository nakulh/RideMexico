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
app.factory('MetroTrainRouteService', function($http, $q){
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
        for(x; x < routes.length; x++){
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
                for(x = 0; x < frequencies.length; x++)
                  for(y = 0; y < self.trips.length; y++)
                    if(frequencies[x].trip_id == self.trips[y].trip_id)
                      self.frequencies.push(frequencies[x]);
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

app.factory('BusTripService', function($http, $q){
  self = {};
  self.getTrips = function(routeId){
    var d = $q.defer();
    $http.get('./js/trips.json')
      .success(function(trips){
        var selectedTrips = [];
        for(x = 0; x < trips.length; x++)
          if(trips[x].route_id == routeId)
            selectedTrips.push(trips[x]);
        d.resolve(selectedTrips);
      })
      .error(function(err){
        console.log(err);
      });
    return d.promise;
  };
return self;
});

app.factory('BusTripRouteService', function($http, $q){
  self = {};
  self.getRouteDetails = function(tripId){
    var tripDesc = "";
    self.trips = [];
    self.frequencies = [];
    self.stopTimes = [];
    self.stops = [];
    self.routeTime = "";
    self.shapes = [];
    var d = $q.defer();
    $http.get('./js/trips.json')
      .success(function(trips){
        for(x = 0; x < trips.length; x++)
          if(tripId == trips[x].trip_id)
            tripDesc = trips[x].trip_desc;
        for(x = 0; x < trips.length; x++)
          if(tripDesc.trim() == trips[x].trip_desc.trim())
            self.trips.push(trips[x]);
        $http.get('./js/frequencies.json')
          .success(function(frequencies){
            for(x = 0; x < frequencies.length; x++)
              for(y = 0; y < self.trips.length; y++)
                if(frequencies[x].trip_id == self.trips[y].trip_id)
                  self.frequencies.push(frequencies[x]);
          })
          .error(function(err){
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
      .error(function(err){
        console.log(err);
      });
    return d.promise;
  };
  return self;
});

app.factory('BusTripCalenderService', function($http, $q){
  var self = {};
  self.getCalender = function(diffServiceId){
    self.weeks = [];
    var d = $q.defer();
    for(x = 0; x < diffServiceId.length; x++){
      self.weeks.push([]);
    }
    $http.get('./js/calender.json')
      .success(function(calendar){
        var selectCalender = [];
        for(x = 0; x < diffServiceId.length; x++)
          for(y = 0; y < calendar.length; y++)
            if(calendar[y].service_id == diffServiceId[x])
              selectCalender.push(calendar[y]);
        for(x = 0; x < selectCalender.length; x++){
          if(selectCalender[x].monday == "1")
            self.weeks[x].push("Monday");
          if(selectCalender[x].tuesday == "1")
            self.weeks[x].push("Tuesday");
          if(selectCalender[x].wednesday == "1")
            self.weeks[x].push("Wednesday");
          if(selectCalender[x].thursday == "1")
            self.weeks[x].push("Thursday");
          if(selectCalender[x].friday == "1")
            self.weeks[x].push("Friday");
          if(selectCalender[x].saturday == "1")
            self.weeks[x].push("Saturday");
          if(selectCalender[x].sunday == "1")
            self.weeks[x].push("Sunday");
          console.log(self.weeks[x]);
        }
      d.resolve(self.weeks);
    })
    .error(function(err){
      console.log(err);
    });
    return d.promise;
  };
  return self;
});
