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
    console.log(data);
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
    console.log(data);
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
    console.log(data);
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
