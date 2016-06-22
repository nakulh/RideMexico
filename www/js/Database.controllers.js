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

app.controller('MetroRouteController', function($scope, MetroRouteService, $stateParams){
  $scope.trips = [];
  MetroRouteService.getRouteDetails($stateParams.routeId).then(function success(data){
    var routesSeg1 = [];
    var routesSeg2 = [];
    var routesSegS1 = [];
    var routesSegS2 = [];
    $scope.frequenciesSeg1 = [];
    $scope.frequenciesSeg2 = [];
    $scope.stops = MetroRouteService.stops;

    //segment trips on basis of forward and reverse trip (Seg1 is forward)
    for(x = 0; x < MetroRouteService.trips.length; x++){
      if(MetroRouteService.trips[x].trip_desc.trim() == MetroRouteService.route.route_long_name.trim())
        routesSeg1.push(MetroRouteService.trips[x]);
      else
        routesSeg2.push(MetroRouteService.trips[x]);
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

    $scope.route = MetroRouteService.route;
    $scope.tripf = routesSegS1;
    $scope.tripb = routesSegS2;

    //This portion aligns frequencies according to trips
    for(x = 0; x < routesSegS1.length; x++)
      for(y = 0; y < MetroRouteService.frequencies.length; y++)
        if(routesSegS1[x].trip_id == MetroRouteService.frequencies[y].trip_id)
          $scope.frequenciesSeg1.push(MetroRouteService.frequencies[y]);

    for(x = 0; x < routesSegS2.length; x++)
      for(y = 0; y < MetroRouteService.frequencies.length; y++)
        if(routesSegS2[x].trip_id == MetroRouteService.frequencies[y].trip_id)
          $scope.frequenciesSeg2.push(MetroRouteService.frequencies[y]);

    //Make a string out of the shapes information
    $scope.shapes = "";
    for(x = 0; x < MetroRouteService.shapes.length; x++){
      $scope.shapes += "[" + MetroRouteService.shapes[x].shape_pt_lat + "," + MetroRouteService.shapes[x].shape_pt_lon + "],";
    }
    $scope.shapes = "[" + $scope.shapes.slice(0, -1) + "]";
    $scope.shapeCenter = "[" + MetroRouteService.shapes[0].shape_pt_lat +  "," + MetroRouteService.shapes[0].shape_pt_lon + "]";
  }, function(err){
    console.log(err);
  });
});

app.controller('StopMapController', function($scope, $stateParams){
  $scope.pos = $stateParams.lat +  "," + $stateParams.lon;
  $scope.name = $stateParams.name;
  $scope.desc = $stateParams.desc;
});
