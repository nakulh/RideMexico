var app = angular.module('Database.controllers', ['routes.services']);

app.controller('DatabaseMenuCtrl', function($scope, RoutesService){
  $scope.bus = false;
  $scope.train = false;
  $scope.metro = false;
  $scope.ecobike = false;
  $scope.carrot = false;
  $scope.unknown = false;
  $scope.busToggle = function(){
    $scope.bus = !$scope.bus;
  };
  $scope.trainToggle = function(){
    $scope.train = !$scope.train;
  };
  $scope.metroToggle = function(){
    $scope.metro = !$scope.metro;
  };
  $scope.ecobikeToggle = function(){
    $scope.ecobike = !$scope.ecobike;
  };
  $scope.carrotToggle = function(){
    $scope.carrot = !$scope.carrot;
  };
  $scope.unknownToggle = function(){
    $scope.unknown = !$scope.unknown;
  };

});

app.controller('BusRoutesListController', function($scope, RoutesService){
  $scope.busRoutes = [];
  $scope.routeType = "busRoute";
  var agency = {
    CC: "Corredores Concesionados",
    MB: "Metrobús",
    METRO: "Sistema de Transporte Colectivo Metro",
    NCC: "NOCHEBÚS Corredores concesionados",
    RTP: "Red de Transporte de Pasajeros",
    STE: "Servicio de Transportes Eléctricos",
    SUB: "Ferrocarriles Suburbanos"
  };
  RoutesService.loadRoutes().then(function success(data){
    angular.forEach(data, function(entry){
      if(entry.route_type == "3")
      {
        entry.route_short_name = entry.route_short_name + " by " + agency[entry.agency_id];
        if(entry.route_desc.trim() == "RUTA TRAZADA" || entry.route_desc.trim() == "RUTA TRASADA")
          entry.route_desc = "";
        $scope.busRoutes.push(entry);
      }
    });
  }, function(err){
    console.log(err);
  });
});

app.controller('TrainRoutesListController', function($scope, RoutesService){
  $scope.busRoutes = [];
  $scope.routeType = "trainRoute";
  var agency = {
    CC: "Corredores Concesionados",
    MB: "Metrobús",
    METRO: "Sistema de Transporte Colectivo Metro",
    NCC: "NOCHEBÚS Corredores concesionados",
    RTP: "Red de Transporte de Pasajeros",
    STE: "Servicio de Transportes Eléctricos",
    SUB: "Ferrocarriles Suburbanos"
  };
  RoutesService.loadRoutes().then(function success(data){
    angular.forEach(data, function(entry){
      if(entry.route_type == "2")
      {
        entry.route_short_name = entry.route_short_name + " by " + agency[entry.agency_id];
        if(entry.route_desc.trim() == "RUTA TRAZADA" || entry.route_desc.trim() == "RUTA TRASADA")
          entry.route_desc = "";
        $scope.busRoutes.push(entry);
      }
    });
  }, function(err){
    console.log(err);
  });
});

app.controller('MetroRoutesListController', function($scope, RoutesService){
  $scope.busRoutes = [];
  $scope.routeType = "metroRoute";
  var agency = {
    CC: "Corredores Concesionados",
    MB: "Metrobús",
    METRO: "Sistema de Transporte Colectivo Metro",
    NCC: "NOCHEBÚS Corredores concesionados",
    RTP: "Red de Transporte de Pasajeros",
    STE: "Servicio de Transportes Eléctricos",
    SUB: "Ferrocarriles Suburbanos"
  };
  RoutesService.loadRoutes().then(function success(data){
    angular.forEach(data, function(entry){
      if(entry.route_type == "1")
      {
        entry.route_short_name = entry.route_short_name + " by " + agency[entry.agency_id];
        if(entry.route_desc.trim() == "RUTA TRAZADA" || entry.route_desc.trim() == "RUTA TRASADA")
          entry.route_desc = "";
        $scope.busRoutes.push(entry);
      }
    });
  }, function(err){
    console.log(err);
  });
});

app.controller('MetroRouteController', function($scope, MetroTrainRouteService, $stateParams){
  MetroTrainRouteService.getRouteDetails($stateParams.routeId).then(function success(data){
    var routesSeg1 = [];
    var routesSeg2 = [];
    var routesSegS1 = [];
    var routesSegS2 = [];
    $scope.frequenciesSeg1 = [];
    $scope.frequenciesSeg2 = [];
    $scope.stops = MetroTrainRouteService.stops;
    $scope.routeTime = MetroTrainRouteService.routeTime;

    //segment trips on basis of forward and reverse trip (Seg1 is forward)
    for(x = 0; x < MetroTrainRouteService.trips.length; x++){
      if(MetroTrainRouteService.trips[x].trip_desc.trim() == MetroTrainRouteService.route.route_long_name.trim())
        routesSeg1.push(MetroTrainRouteService.trips[x]);
      else
        routesSeg2.push(MetroTrainRouteService.trips[x]);
    }

    //Aligns trips according to days: Monday to friday && Sat && Sun
    for(x = 0; x < routesSeg1.length; x++)
      if(routesSeg1[x].service_id == 14741)
        routesSegS1.push(routesSeg1[x]);

    for(x = 0; x < routesSeg1.length; x++)
      if(routesSeg1[x].service_id == 16203)
        routesSegS1.push(routesSeg1[x]);

    for(x = 0; x < routesSeg1.length; x++)
      if(routesSeg1[x].service_id == 28960)
        routesSegS1.push(routesSeg1[x]);

    for(x = 0; x < routesSeg2.length; x++)
      if(routesSeg2[x].service_id == 14741)
        routesSegS2.push(routesSeg1[x]);

    for(x = 0; x < routesSeg2.length; x++)
      if(routesSeg2[x].service_id == 16203)
        routesSegS2.push(routesSeg1[x]);

    for(x = 0; x < routesSeg2.length; x++)
      if(routesSeg2[x].service_id == 28960)
        routesSegS2.push(routesSeg1[x]);

    $scope.route = MetroTrainRouteService.route;
    $scope.tripf = routesSegS1;
    $scope.tripb = routesSegS2;

    //This portion aligns frequencies according to trips
    for(x = 0; x < routesSegS1.length; x++)
      for(y = 0; y < MetroTrainRouteService.frequencies.length; y++)
        if(routesSegS1[x].trip_id == MetroTrainRouteService.frequencies[y].trip_id)
          $scope.frequenciesSeg1.push(MetroTrainRouteService.frequencies[y]);

    for(x = 0; x < routesSegS2.length; x++)
      for(y = 0; y < MetroTrainRouteService.frequencies.length; y++)
        if(routesSegS2[x].trip_id == MetroTrainRouteService.frequencies[y].trip_id)
          $scope.frequenciesSeg2.push(MetroTrainRouteService.frequencies[y]);

    //Make a string out of the shapes information
    $scope.shapes = "";
    for(x = 0; x < MetroTrainRouteService.shapes.length; x++){
      $scope.shapes += "[" + MetroTrainRouteService.shapes[x].shape_pt_lat + "," + MetroTrainRouteService.shapes[x].shape_pt_lon + "],";
    }
    $scope.shapes = "[" + $scope.shapes.slice(0, -1) + "]";
    $scope.shapeCenter = "[" + MetroTrainRouteService.shapes[0].shape_pt_lat +  "," + MetroTrainRouteService.shapes[0].shape_pt_lon + "]";
    $scope.stopsMap = [];
    var stopMap = "";
    for(x = 0; x < $scope.stops.length; x++){
      stopMap = $scope.stops[x].stop_lat + "," + $scope.stops[x].stop_lon;
      $scope.stopsMap.push(stopMap);
    }
  }, function(err){
    console.log(err);
  });
});

app.controller('StopMapController', function($scope, $stateParams){
  $scope.pos = $stateParams.lat +  "," + $stateParams.lon;
  $scope.name = $stateParams.name;
  $scope.desc = $stateParams.desc;
});

app.controller('TrainRouteController', function($scope, MetroTrainRouteService, $stateParams){
  MetroTrainRouteService.getRouteDetails($stateParams.routeId).then(function success(data){
    $scope.cont = false;
    var routesSeg1 = [];
    var routesSegS1 = [];
    $scope.frequenciesSeg1 = [];
    $scope.stops = MetroTrainRouteService.stops;
    $scope.routeTime = MetroTrainRouteService.routeTime;

    for(x = 0; x < MetroTrainRouteService.trips.length; x++)
      if(MetroTrainRouteService.trips[x].trip_desc.trim() == MetroTrainRouteService.route.route_long_name.trim())
        routesSeg1.push(MetroTrainRouteService.trips[x]);
    if(routesSeg1[0].trip_desc.trim() == "Xochimilco - Tasqueña" || routesSeg1[0].trip_desc.trim() == "Tasqueña - Xochimilco"){
      $scope.cont = true;
      for(x = 0; x < routesSeg1.length; x++)
        if(routesSeg1[x].service_id == 38754)
          routesSegS1.push(routesSeg1[x]);

      for(x = 0; x < routesSeg1.length; x++)
        if(routesSeg1[x].service_id == 38824)
          routesSegS1.push(routesSeg1[x]);

      for(x = 0; x < routesSeg1.length; x++)
        if(routesSeg1[x].service_id == 38827)
          routesSegS1.push(routesSeg1[x]);
    }
    else{
      for(x = 0; x < routesSeg1.length; x++)
        if(routesSeg1[x].service_id == 26656)
          routesSegS1.push(routesSeg1[x]);

      for(x = 0; x < routesSeg1.length; x++)
        if(routesSeg1[x].service_id == 36384)
          routesSegS1.push(routesSeg1[x]);

      for(x = 0; x < routesSeg1.length; x++)
        if(routesSeg1[x].service_id == 26949)
          routesSegS1.push(routesSeg1[x]);
    }
    //This portion aligns frequencies according to trips
    $scope.route = MetroTrainRouteService.route;
    $scope.trip = routesSegS1;
    for(x = 0; x < routesSegS1.length; x++)
      for(y = 0; y < MetroTrainRouteService.frequencies.length; y++)
        if(routesSegS1[x].trip_id == MetroTrainRouteService.frequencies[y].trip_id.trim())
          $scope.frequenciesSeg1.push(MetroTrainRouteService.frequencies[y]);

    //Make a string out of the shapes information
    $scope.shapes = "";
    for(x = 0; x < MetroTrainRouteService.shapes.length; x++)
      $scope.shapes += "[" + MetroTrainRouteService.shapes[x].shape_pt_lat + "," + MetroTrainRouteService.shapes[x].shape_pt_lon + "],";
    $scope.shapes = "[" + $scope.shapes.slice(0, -1) + "]";
    $scope.shapeCenter = "[" + MetroTrainRouteService.shapes[0].shape_pt_lat +  "," + MetroTrainRouteService.shapes[0].shape_pt_lon + "]";

    $scope.stopsMap = [];
    var stopMap = "";
    for(x = 0; x < $scope.stops.length; x++){
      stopMap = $scope.stops[x].stop_lat + "," + $scope.stops[x].stop_lon;
      $scope.stopsMap.push(stopMap);
    }
  }, function(err){
    console.log(err);
  });
});

app.controller('BusTripController', function($scope, $stateParams, BusTripService){
  BusTripService.getTrips($stateParams.routeId).then(function success(trips){
    var multipleTrips = trips;
    $scope.trips = [];
    $scope.routeId = $stateParams.routeId;
    $scope.trips.push(trips[0]);
    for(x = 0; x < trips.length; x++){
      var there = false;
      for(y = 0; y < $scope.trips.length; y++)
        if($scope.trips[y].trip_desc.trim() == trips[x].trip_desc.trim())
          there = true;
      if(!there)
        $scope.trips.push(trips[x]);
    }
  }, function(err){
    console.log(err);
  });
});

app.controller('BusTripRouteController', function($scope, $stateParams, BusTripRouteService, $http, BusTripCalenderService){
  BusTripRouteService.getRouteDetails($stateParams.tripId).then(function(data){
    $scope.stops = BusTripRouteService.stops;
    $scope.routeTime = BusTripRouteService.routeTime;
    $scope.tripId = $stateParams.tripId;
    $scope.weeks = [];
    var diffServiceId = [];
    diffServiceId.push(BusTripRouteService.trips[0].service_id);
    for(x = 0; x < BusTripRouteService.trips.length; x++){
      there = false;
      for(y = 0; y < diffServiceId.length; y++)
        if(diffServiceId[y] == BusTripRouteService.trips[x].service_id)
          there = true;
    if(!there)
      diffServiceId.push(BusTripRouteService.trips[x].service_id);
    }

    var multipleTrips = [];
    $scope.trips = [];
    $scope.frequencies = [];
    $scope.oneFrequency = [];
    $scope.twoFrequency = [];
    $scope.threeFrequency = [];
    $scope.fourFrequency = [];
    for(x = 0; x < diffServiceId.length; x++)
      multipleTrips.push(0);
    for(x = 0; x < diffServiceId.length; x++)
      for(y = 0; y < BusTripRouteService.trips.length; y++)
        if(diffServiceId[x] == BusTripRouteService.trips[y].service_id){
          $scope.trips.push(BusTripRouteService.trips[y]);
          multipleTrips[x]  += 1;
        }

    for(x = 0; x < $scope.trips.length; x++)
      for(y = 0; y < BusTripRouteService.frequencies.length; y++)
        if(BusTripRouteService.frequencies[y].trip_id.trim() == $scope.trips[x].trip_id)
          $scope.frequencies.push(BusTripRouteService.frequencies[y]);

    for(x = 0; x < multipleTrips[0]; x++)
      $scope.oneFrequency.push($scope.frequencies[x]);
    if(multipleTrips[1])
      for(x = multipleTrips[0]; x < multipleTrips[0] + multipleTrips[1]; x++)
        $scope.twoFrequency.push($scope.frequencies[x]);
    if(multipleTrips[2])
      for(x = multipleTrips[0] + multipleTrips[1]; x < multipleTrips[2] + multipleTrips[0] + multipleTrips[1]; x++)
        $scope.threeFrequency.push($scope.frequencies[x]);
    if(multipleTrips[3])
      for(x = multipleTrips[0] + multipleTrips[1] + multipleTrips[2]; x < multipleTrips[3] + multipleTrips[2] + multipleTrips[0] + multipleTrips[1]; x++)
        $scope.fourFrequency.push($scope.frequencies[x]);
    $scope.frequencies = [$scope.oneFrequency, $scope.twoFrequency, $scope.threeFrequency, $scope.fourFrequency];
  /*this.datas = $scope.weeks.map(function(value, index) {
      return {
        week: value,
        frequency: frequencies[index]
      };
    });*/

    BusTripCalenderService.getCalender(diffServiceId).then(function(weeks){
      $scope.weeks = weeks;

    }, function(err){
      console.log(err);
    });
    //Make a string out of the shapes information
    $scope.shapes = "";
    for(x = 0; x < BusTripRouteService.shapes.length; x++)
      $scope.shapes += "[" + BusTripRouteService.shapes[x].shape_pt_lat + "," + BusTripRouteService.shapes[x].shape_pt_lon + "],";
    $scope.shapes = "[" + $scope.shapes.slice(0, -1) + "]";
    $scope.shapeCenter = "[" + BusTripRouteService.shapes[0].shape_pt_lat +  "," + BusTripRouteService.shapes[0].shape_pt_lon + "]";

    $scope.stopsMap = [];
    var stopMap = "";
    for(x = 0; x < $scope.stops.length; x++){
      stopMap = $scope.stops[x].stop_lat + "," + $scope.stops[x].stop_lon;
    $scope.stopsMap.push(stopMap);
    }

  for(x = 0; x < BusTripRouteService.trips.length; x++)
      console.log(BusTripRouteService.trips[x]);
  for(x = 0; x < diffServiceId.length; x++)
    console.log(diffServiceId[x]);
  for(x = 0; x < $scope.oneFrequency.length; x++)
    console.log($scope.oneFrequency[x]);
  console.log(multipleTrips);
  }, function(err){
      console.log(err);
  });
});
