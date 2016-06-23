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
