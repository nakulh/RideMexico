var app = angular.module('Database.controllers', ['routes.services']);

app.controller('DatabaseMenuCtrl', function($scope, RoutesService, $cordovaToast){
  $scope.bus = false;
  $scope.train = false;
  $scope.metro = false;
  $scope.carrot = false;
  $scope.busToggle = function(){
    $scope.bus = !$scope.bus;
  };
  $scope.trainToggle = function(){
    $scope.train = !$scope.train;
  };
  $scope.metroToggle = function(){
    $scope.metro = !$scope.metro;
  };
  $scope.carrotToggle = function(){
    $scope.carrot = !$scope.carrot;
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

app.controller('MetroRouteController', function($scope, MetroTrainRouteService, $stateParams, $ionicPopup, $location, $ionicPopover, $ionicLoading, $timeout, $cordovaGeolocation, $cordovaToast){
  $ionicLoading.show({
      template: 'Loading...'
  });
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
    $scope.markersData = [];
    for(x = 0; x < $scope.stops.length; x++){
      stopMap = $scope.stops[x].stop_lat + "," + $scope.stops[x].stop_lon;
      $scope.stopsMap.push(stopMap);
      $scope.markersData.push($scope.stops[x]);
    }
    $ionicLoading.hide();

    //This Part Handles the add card function
  }, function(err){
    console.log(err);
  });
  $scope.loadingCards = true;
  var cardKeys = [];
  $scope.cards = [];

  //Retrive tags
  firebase.database().ref('/metro/'+ $stateParams.routeId + '/tags/').once('value').then(function(value) {
    console.log(value.val());
    $scope.tags = {};
    if(value.val() === null){
      $scope.tags.conjusted = 0;
      $scope.tags.like = 0;
      $scope.tags.late = 0;
      $scope.tags.unmaintained = 0;
    }
    else{
      $scope.tags = value.val();
    }
    if(!$scope.tags.conjusted){
      $scope.tags.conjusted = 0;
    }
    if(!$scope.tags.like){
      $scope.tags.like = 0;
    }
    if(!$scope.tags.late){
      $scope.tags.late = 0;
    }
    if(!$scope.tags.unmaintained){
      $scope.tags.unmaintained = 0;
    }
    $scope.$apply();
    console.log($scope.tags);
  }, function(err){
    console.log(err);
    console.log("no net");
  });
  $scope.tagsEdit = function(tag){
    console.log(tag);
    var user = firebase.auth().currentUser;
    firebase.database().ref('/users/' + user.uid + '/metro/' + tag + '/' + $stateParams.routeId).once('value').then(function(tagInfo){
      if(!tagInfo.val()){
        firebase.database().ref('/metro/'+ $stateParams.routeId + '/tags/' + tag).once('value').then(function(value) {
          var updates = {};
          var newValue = 1;
          console.log(value.val());
          if(value.val() !== null){
            newValue = value.val() + 1;
          }
          updates['/metro/' + $stateParams.routeId + '/tags/' + tag] = newValue;
          firebase.database().ref().update(updates).then(function(done){
            console.log(newValue);
            updates = {};
            updates['/users/' + user.uid + '/metro/' + tag + '/' + $stateParams.routeId] = true;
            firebase.database().ref().update(updates).then(function(done){
              $scope.tags[tag] = $scope.tags[tag] + 1;
              $scope.$apply();
            });
          });
        });
      }
    });
  };
  //Retrive Card Data from Server
  //Retrive images
  var getImage = function(x){
    if($scope.cards[x].image){
      var currKey = cardKeys[x];
      console.log(currKey);
      firebase.database().ref('/cards/images/'+ currKey).once('value').then(function(imgData){
        $scope.cards[x].imageData = "data:image/jpeg;base64," + imgData.val();
      });
    }
  };
  firebase.database().ref('/cards/metro/'+ $stateParams.routeId + "/").once('value').then(function(cards) {
    for (var key in cards.val()) {
      if (cards.val().hasOwnProperty(key)) {
        $scope.cards.push(cards.val()[key]);
        cardKeys.push(key);
        $scope.cards[$scope.cards.length - 1].emoImg = [];
        var emotionsArr = ['angry', 'confused', 'dislike', 'happy', 'hurt', 'like', 'question', 'sad', 'vomit'];
        var emoDir = {
          angry: 'img/emotions/angry.png',
          confused: 'img/emotions/confused.png',
          dislike: 'img/emotions/dislike.png',
          happy: 'img/emotions/happy.png',
          hurt: 'img/emotions/hurt.png',
          like: 'img/emotions/like.png',
          question: 'img/emotions/question.png',
          sad: 'img/emotions/sad.png',
          vomit: 'img/emotions/vomit.png'
        };
        $scope.loadingCards = false;
        for(var emo in emotionsArr){
          if($scope.cards[$scope.cards.length - 1].emotions[emotionsArr[emo]])
            $scope.cards[$scope.cards.length - 1].emoImg.push(emoDir[emotionsArr[emo]]);
        }
        $scope.$apply();
      }
    }
    $scope.cards = $scope.cards.reverse();
    for(var y = 0; y < $scope.cards.length; y++){
      getImage(y);
    }
    $scope.$apply();
  });

  //Like A Card
  $scope.likeCard = function(indx){
    var currKey = cardKeys[indx];
    var user = firebase.auth().currentUser;
    firebase.database().ref('/users/'+ user.uid + "/likes/" + currKey).once('value').then(function(like) {
      if(!like.val()){
        var update = {};
        update['/users/'+ user.uid + "/likes/" + currKey] = {value: true};
        firebase.database().ref().update(update).then(function(done){
          update = {};
          var l = ++$scope.cards[indx].likes;
          //console.log($scope.cards[indx]);
          update['/cards/metro/' + $stateParams.routeId + '/' + currKey + '/likes'] = l;
          firebase.database().ref().update(update).then(function(done){
            console.log("liked");
            $scope.$apply();
          });
        });
      }
    });
  };
  $scope.addCard = function($event) {
     if (firebase.auth().currentUser) {
        var path = "/app/addcard/" + $stateParams.routeId + "/x/" + "metro";
        $location.path(path);
      } else {
        $ionicPopup.alert({
          title: 'Ouchie !',
          template: 'You must be logged in to use this function'
        });
      }
  };
  $timeout(function(){$scope.loadingCards = false;}, 15000);

  $scope.showPopup = function() {
    $scope.openMap = function(stop){
      var posOptions = {timeout: 10000, enableHighAccuracy: false};
      $cordovaGeolocation
        .getCurrentPosition(posOptions)
        .then(function (position) {
          var source  = [position.coords.latitude, position.coords.longitude];
          var dest = [stop.stop_lat, stop.stop_lon];
          launchnavigator.navigate(dest, source);
        }, function(err) {
          $cordovaToast.showLongBottom('Problem with your Gps');
        });
    };
    $scope.currData = this.data;
    $scope.imgUrl = "https://maps.googleapis.com/maps/api/streetview?size=230x100&location="+$scope.currData.stop_lat+","+$scope.currData.stop_lon+"&heading=151.78&pitch=-0.76&key=AIzaSyDtZm_v8XKJd4VOqMdonzpM02t0zweJS3E";
    var alertPopup = $ionicPopup.alert({
     scope: $scope,
     title: 'Selected Stop',
     template: '<ion-list><ion-item>Stop: {{currData.stop_name}}</ion-item></ion-list><img class="padding-top" ng-src={{imgUrl}} alt="Description"/><button ng-click="openMap(currData)" class="button button-small button-clear button-positive">Get directions</button>'
    });
  };
  $scope.openLocation = function(location){
    console.log(location);
    console.log("open location");
    var posOptions = {timeout: 10000, enableHighAccuracy: false};
    $cordovaGeolocation
      .getCurrentPosition(posOptions)
      .then(function (position) {
        var source  = [position.coords.latitude, position.coords.longitude];
        var dest = [location.lat, location.lon];
        launchnavigator.navigate(dest, source);
      }, function(err) {
        $cordovaToast.showLongBottom('Problem with your Gps');
      });
  };
});

app.controller('StopMapController', function($scope, $stateParams, $ionicPopup){
  $scope.pos = $stateParams.lat +  "," + $stateParams.lon;
  $scope.name = $stateParams.name;
  $scope.desc = $stateParams.desc;
  $scope.showPopup = function() {
    var i = $scope.markersData.indexOf(this.data);
    $scope.currData = this.data;
    $scope.imgUrl = "https://maps.googleapis.com/maps/api/streetview?size=230x100&location="+$stateParams.lat+","+$stateParams.lon+"&heading=151.78&pitch=-0.76&key=AIzaSyDtZm_v8XKJd4VOqMdonzpM02t0zweJS3E";
    var alertPopup = $ionicPopup.alert({
     scope: $scope,
     title: 'Selected Stop',
     template: '<img class="padding-top" ng-src={{imgUrl}} alt="Description" />'
    });
 };
});

app.controller('TrainRouteController', function($scope, MetroTrainRouteService, $stateParams, $location, $timeout, $ionicLoading, $cordovaGeolocation, $ionicPopup, $cordovaToast){
  $ionicLoading.show({
      template: 'Loading...'
  });
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
    for(x=0; x < MetroTrainRouteService.route.length; x++){
      console.log(MetroTrainRouteService.route[x]);
    }
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

    //Retrive Card Data from Server
    firebase.database().ref('/cards/train/'+ $stateParams.routeId + "/").once('value').then(function(cards) {
      //console.log(cards.val());
        for (var key in cards.val()) {
          if (cards.val().hasOwnProperty(key)) {
            //console.log(key); // 'a'
            //console.log(cards.val()[key]); // 'hello'
          }
        }
    });
    //Make a string out of the shapes information
    $scope.shapes = "";
    for(x = 0; x < MetroTrainRouteService.shapes.length; x++)
      $scope.shapes += "[" + MetroTrainRouteService.shapes[x].shape_pt_lat + "," + MetroTrainRouteService.shapes[x].shape_pt_lon + "],";
    $scope.shapes = "[" + $scope.shapes.slice(0, -1) + "]";
    $scope.shapeCenter = "[" + MetroTrainRouteService.shapes[0].shape_pt_lat +  "," + MetroTrainRouteService.shapes[0].shape_pt_lon + "]";

    $scope.stopsMap = [];
    var stopMap = "";
    $scope.markersData = [];
    for(x = 0; x < $scope.stops.length; x++){
      stopMap = $scope.stops[x].stop_lat + "," + $scope.stops[x].stop_lon;
      $scope.stopsMap.push(stopMap);
      $scope.markersData.push($scope.stops[x]);
    }
    //Handles new card
    $ionicLoading.hide();
    $scope.addCard = function($event) {
       if (firebase.auth().currentUser) {
          var path = "/app/addcard/" + $stateParams.routeId + "/x/" + "train";
          $location.path(path);
        } else {
          $ionicPopup.alert({
            title: 'Ouchie !',
            template: 'You must be logged in to use this function'
          });
        }
    };
  }, function(err){
    console.log(err);
  });
  var cardKeys = [];
  $scope.cards = [];
  firebase.database().ref('/train/'+ $stateParams.routeId + '/tags/').once('value').then(function(value) {
    $scope.tags = {};
    if(value.val() === null){
      $scope.tags.conjusted = 0;
      $scope.tags.like = 0;
      $scope.tags.late = 0;
      $scope.tags.unmaintained = 0;
    }
    else{
      $scope.tags = value.val();
    }
    if(!$scope.tags.conjusted){
      $scope.tags.conjusted = 0;
    }
    if(!$scope.tags.like){
      $scope.tags.like = 0;
    }
    if(!$scope.tags.late){
      $scope.tags.late = 0;
    }
    if(!$scope.tags.unmaintained){
      $scope.tags.unmaintained = 0;
    }
    $scope.$apply();
    console.log($scope.tags);
  });
  $scope.tagsEdit = function(tag){
    console.log(tag);
    var user = firebase.auth().currentUser;
    firebase.database().ref('/users/' + user.uid + '/train/' + tag + '/' + $stateParams.routeId).once('value').then(function(tagInfo){
      if(!tagInfo.val()){
        firebase.database().ref('/train/'+ $stateParams.routeId + '/tags/' + tag).once('value').then(function(value) {
          var updates = {};
          var newValue = 1;
          console.log(value.val());
          if(value.val() !== null){
            newValue = value.val() + 1;
          }
          updates['/train/' + $stateParams.routeId + '/tags/' + tag] = newValue;
          firebase.database().ref().update(updates).then(function(done){
            console.log(newValue);
            updates = {};
            updates['/users/' + user.uid + '/train/' + tag + '/' + $stateParams.routeId] = true;
            firebase.database().ref().update(updates).then(function(done){
              $scope.tags[tag] = $scope.tags[tag] + 1;
              $scope.$apply();
            });
          });
        });
      }
    });
  };
  //Retrive Card Data from Server
  //Retrive images
  var getImage = function(x){
    if($scope.cards[x].image){
      var currKey = cardKeys[x];
      console.log(currKey);
      firebase.database().ref('/cards/images/'+ currKey).once('value').then(function(imgData){
        $scope.cards[x].imageData = "data:image/jpeg;base64," + imgData.val();
      });
    }
  };
  $scope.loadingCards = true;
  firebase.database().ref('/cards/train/'+ $stateParams.routeId + "/").once('value').then(function(cards) {
    console.log(cards.val());
    for (var key in cards.val()) {
      if (cards.val().hasOwnProperty(key)) {
        $scope.cards.push(cards.val()[key]);
        cardKeys.push(key);
        $scope.cards[$scope.cards.length - 1].emoImg = [];
        var emotionsArr = ['angry', 'confused', 'dislike', 'happy', 'hurt', 'like', 'question', 'sad', 'vomit'];
        var emoDir = {
          angry: 'img/emotions/angry.png',
          confused: 'img/emotions/confused.png',
          dislike: 'img/emotions/dislike.png',
          happy: 'img/emotions/happy.png',
          hurt: 'img/emotions/hurt.png',
          like: 'img/emotions/like.png',
          question: 'img/emotions/question.png',
          sad: 'img/emotions/sad.png',
          vomit: 'img/emotions/vomit.png'
        };
        for(var emo in emotionsArr){
          if($scope.cards[$scope.cards.length - 1].emotions[emotionsArr[emo]]){
            $scope.cards[$scope.cards.length - 1].emoImg.push(emoDir[emotionsArr[emo]]);
          }
        }
      }
    }
    $scope.cards = $scope.cards.reverse();
    $scope.loadingCards = false;
    for(var y = 0; y < $scope.cards.length; y++){
      getImage(y);
    }
    $scope.$apply();
  });

  $scope.likeCard = function(indx){
    var currKey = cardKeys[indx];
    var user = firebase.auth().currentUser;
    firebase.database().ref('/users/'+ user.uid + "/likes/" + currKey).once('value').then(function(like) {
      if(!like.val()){
        var update = {};
        update['/users/'+ user.uid + "/likes/" + currKey] = {value: true};
        firebase.database().ref().update(update).then(function(done){
          update = {};
          var l = ++$scope.cards[indx].likes;
          console.log($scope.cards[indx]);
          update['/cards/train/' + $stateParams.routeId + '/' + currKey + '/likes'] = l;
          firebase.database().ref().update(update).then(function(done){
            console.log("liked");
            $scope.$apply();
          });
        });
      }
    });
  };
  $timeout(function(){$scope.loadingCards = false;}, 15000);

  $scope.showPopup = function() {
    $scope.openMap = function(stop){
      var posOptions = {timeout: 10000, enableHighAccuracy: false};
      $cordovaGeolocation
        .getCurrentPosition(posOptions)
        .then(function (position) {
          var source  = [position.coords.latitude, position.coords.longitude];
          var dest = [stop.stop_lat, stop.stop_lon];
          launchnavigator.navigate(dest, source);
        }, function(err) {
          $cordovaToast.showLongBottom('Problem with your Gps');
        });
    };
    $scope.currData = this.data;
    $scope.imgUrl = "https://maps.googleapis.com/maps/api/streetview?size=230x100&location="+$scope.currData.stop_lat+","+$scope.currData.stop_lon+"&heading=151.78&pitch=-0.76&key=AIzaSyDtZm_v8XKJd4VOqMdonzpM02t0zweJS3E";
    var alertPopup = $ionicPopup.alert({
     scope: $scope,
     title: 'Selected Stop',
     template: '<ion-list><ion-item>Stop: {{currData.stop_name}}</ion-item></ion-list><img class="padding-top" ng-src={{imgUrl}} alt="Description"/><button ng-click="openMap(currData)" class="button button-small button-clear button-positive">Get directions</button>'
    });
  };
  $scope.openLocation = function(location){
    console.log(location);
    console.log("open location");
    var posOptions = {timeout: 10000, enableHighAccuracy: false};
    $cordovaGeolocation
      .getCurrentPosition(posOptions)
      .then(function (position) {
        var source  = [position.coords.latitude, position.coords.longitude];
        var dest = [location.lat, location.lon];
        launchnavigator.navigate(dest, source);
      }, function(err) {
        $cordovaToast.showLongBottom('Problem with your Gps');
      });
  };
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

app.controller('BusTripRouteController', function($scope, $stateParams, BusTripRouteService, $http, BusTripCalenderService, $location, $timeout, $ionicLoading, $ionicPopup, $cordovaGeolocation, $cordovaToast){
  var cardKeys = [];
  $scope.cards = [];

  //Retrive tags
  firebase.database().ref('/bus/'+ $stateParams.routeId + '/' + $stateParams.tripId + '/tags/').once('value').then(function(value) {
    $scope.tags = {};
    if(value.val() === null){
      $scope.tags.conjusted = 0;
      $scope.tags.like = 0;
      $scope.tags.late = 0;
      $scope.tags.unmaintained = 0;
    }
    else{
      $scope.tags = value.val();
    }
    if(!$scope.tags.conjusted){
      $scope.tags.conjusted = 0;
    }
    if(!$scope.tags.like){
      $scope.tags.like = 0;
    }
    if(!$scope.tags.late){
      $scope.tags.late = 0;
    }
    if(!$scope.tags.unmaintained){
      $scope.tags.unmaintained = 0;
    }
    $scope.$apply();
    console.log($scope.tags);
  });
  $scope.tagsEdit = function(tag){
    console.log(tag);
    var user = firebase.auth().currentUser;
    firebase.database().ref('/users/' + user.uid + '/bus/' + tag + '/' + $stateParams.routeId + '/' + $stateParams.tripId).once('value').then(function(tagInfo){
      if(!tagInfo.val()){
        firebase.database().ref('/bus/'+ $stateParams.routeId + '/' + $stateParams.tripId + '/tags/' + tag).once('value').then(function(value) {
          var updates = {};
          var newValue = 1;
          console.log(value.val());
          if(value.val() !== null){
            newValue = value.val() + 1;
          }
          updates['/bus/' + $stateParams.routeId + '/' + $stateParams.tripId + '/tags/' + tag] = newValue;
          firebase.database().ref().update(updates).then(function(done){
            console.log(newValue);
            updates = {};
            updates['/users/' + user.uid + '/bus/' + tag + '/' + $stateParams.routeId  + '/' + $stateParams.tripId] = true;
            firebase.database().ref().update(updates).then(function(done){
              $scope.tags[tag] = $scope.tags[tag] + 1;
              $scope.$apply();
            });
          });
        });
      }
    });
  };
  //Retrive Card Data from Server
  //Retrive images
  var getImage = function(x){
    if($scope.cards[x].image){
      var currKey = cardKeys[x];
      console.log(currKey);
      firebase.database().ref('/cards/images/'+ currKey).once('value').then(function(imgData){
        $scope.cards[x].imageData = "data:image/jpeg;base64," + imgData.val();
      });
    }
  };
  $scope.loadingCards = true;
  firebase.database().ref('/cards/bus/'+ $stateParams.routeId + '/' + $stateParams.tripId + '/').once('value').then(function(cards) {
    console.log(cards.val());
    for (var key in cards.val()) {
      if (cards.val().hasOwnProperty(key)) {
        $scope.cards.push(cards.val()[key]);
        cardKeys.push(key);
        $scope.cards[$scope.cards.length - 1].emoImg = [];
        var emotionsArr = ['angry', 'confused', 'dislike', 'happy', 'hurt', 'like', 'question', 'sad', 'vomit'];
        var emoDir = {
          angry: 'img/emotions/angry.png',
          confused: 'img/emotions/confused.png',
          dislike: 'img/emotions/dislike.png',
          happy: 'img/emotions/happy.png',
          hurt: 'img/emotions/hurt.png',
          like: 'img/emotions/like.png',
          question: 'img/emotions/question.png',
          sad: 'img/emotions/sad.png',
          vomit: 'img/emotions/vomit.png'
        };
        for(var emo in emotionsArr){
          if($scope.cards[$scope.cards.length - 1].emotions[emotionsArr[emo]]){
            $scope.cards[$scope.cards.length - 1].emoImg.push(emoDir[emotionsArr[emo]]);
          }
        }
      }
    }
    $scope.cards = $scope.cards.reverse();
    $scope.loadingCards = false;
    for(var y = 0; y < $scope.cards.length; y++){
      getImage(y);
    }
    $scope.$apply();
  });

  $scope.likeCard = function(indx){
    var currKey = cardKeys[indx];
    var user = firebase.auth().currentUser;
    firebase.database().ref('/users/'+ user.uid + "/likes/" + currKey).once('value').then(function(like) {
      if(!like.val()){
        var update = {};
        update['/users/'+ user.uid + "/likes/" + currKey] = {value: true};
        firebase.database().ref().update(update).then(function(done){
          update = {};
          var l = ++$scope.cards[indx].likes;
          console.log($scope.cards[indx]);
          update['/cards/metro/' + $stateParams.routeId + '/' + $stateParams.tripId + '/' + currKey + '/likes'] = l;
          firebase.database().ref().update(update).then(function(done){
            console.log("liked");
            $scope.$apply();
          });
        });
      }
    });
  };
  $ionicLoading.show({
      template: 'Loading...'
  });
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

    BusTripCalenderService.getCalender(diffServiceId).then(function(weeks){
      $scope.weeks = weeks;

    }, function(err){
      console.log(err);
    });

    //Retrive Card Data from Server
    firebase.database().ref('/cards/bus/'+ $stateParams.routeId + "/" + $stateParams.tripId).once('value').then(function(cards) {
      console.log(cards.val());
      for (var key in cards.val()) {
        if (cards.val().hasOwnProperty(key)) {
          console.log(key); // 'a'
          console.log(cards.val()[key]); // 'hello'
        }
      }
    });
    //Make a string out of the shapes information
    $scope.shapes = "";
    for(x = 0; x < BusTripRouteService.shapes.length; x++)
      $scope.shapes += "[" + BusTripRouteService.shapes[x].shape_pt_lat + "," + BusTripRouteService.shapes[x].shape_pt_lon + "],";
    $scope.shapes = "[" + $scope.shapes.slice(0, -1) + "]";
    $scope.shapeCenter = "[" + BusTripRouteService.shapes[0].shape_pt_lat +  "," + BusTripRouteService.shapes[0].shape_pt_lon + "]";

    $scope.stopsMap = [];
    $scope.markersData = [];
    var stopMap = "";
    for(x = 0; x < $scope.stops.length; x++){
      stopMap = $scope.stops[x].stop_lat + "," + $scope.stops[x].stop_lon;
      $scope.stopsMap.push(stopMap);
      $scope.markersData.push($scope.stops[x]);
    }

  /*for(x = 0; x < BusTripRouteService.trips.length; x++)
      console.log(BusTripRouteService.trips[x]);
  for(x = 0; x < diffServiceId.length; x++)
    console.log(diffServiceId[x]);
  for(x = 0; x < $scope.oneFrequency.length; x++)
    console.log($scope.oneFrequency[x]);*/
  //console.log(multipleTrips);

  //Handles new card
  $scope.addCard = function($event) {
     if (firebase.auth().currentUser) {
        var path = "/app/addcard/" + $stateParams.routeId + "/" + $stateParams.tripId + "/" + "bus";
        $location.path(path);
      } else {
        $ionicPopup.alert({
          title: 'Ouchie !',
          template: 'You must be logged in to use this function'
        });
      }
  };
  $timeout(function(){$scope.loadingCards = false;}, 15000);
  $ionicLoading.hide();
  $scope.showPopup = function() {
    $scope.openMap = function(stop){
      var posOptions = {timeout: 10000, enableHighAccuracy: false};
      $cordovaGeolocation
        .getCurrentPosition(posOptions)
        .then(function (position) {
          var source  = [position.coords.latitude, position.coords.longitude];
          var dest = [stop.stop_lat, stop.stop_lon];
          launchnavigator.navigate(dest, source);
        }, function(err) {
          $cordovaToast.showLongBottom('Problem with your Gps');
        });
    };
    $scope.currData = this.data;
    $scope.imgUrl = "https://maps.googleapis.com/maps/api/streetview?size=230x100&location="+$scope.currData.stop_lat+","+$scope.currData.stop_lon+"&heading=151.78&pitch=-0.76&key=AIzaSyDtZm_v8XKJd4VOqMdonzpM02t0zweJS3E";
    var alertPopup = $ionicPopup.alert({
     scope: $scope,
     title: 'Selected Stop',
     template: '<ion-list><ion-item>Stop: {{currData.stop_name}}</ion-item></ion-list><img class="padding-top" ng-src={{imgUrl}} alt="Description"/><button ng-click="openMap(currData)" class="button button-small button-clear button-positive">Get directions</button>'
    });
  };
  $scope.openLocation = function(location){
    console.log(location);
    console.log("open location");
    var posOptions = {timeout: 10000, enableHighAccuracy: false};
    $cordovaGeolocation
      .getCurrentPosition(posOptions)
      .then(function (position) {
        var source  = [position.coords.latitude, position.coords.longitude];
        var dest = [location.lat, location.lon];
        launchnavigator.navigate(dest, source);
      }, function(err) {
        $cordovaToast.showLongBottom('Problem with your Gps');
      });
  };
  }, function(err){
      console.log(err);
  });
});
app.controller('carrotMapCtrl', function($scope, $cordovaGeolocation){
  $scope.center = "[19.350493, -99.163007]";
  $scope.carrot = [
    {
       "lat": 19.350493,
       "lon": -99.163007,
       "car": "Nissan March",
       "img": "nissanmarch.png"
    },
    {
      "lat": 19.3600163,
      "lon": -99.1725862,
      "car": "Nissan Leaf",
      "img": "nissanleaf.png"
    },
    {
      "lat": 19.360181,
      "lon": -99.172179,
      "car": "Toyota Prius",
      "img": "toyotaprius.png"
    },
    {
      "lat": 19.377103,
      "lon": -99.161829,
      "car": "Toyota Hiace Cargo",
      "img": "toyotahiacecargo.png"
    },
    {
      "lat": 19.407543,
      "lon": -99.169464,
      "car": "Nissan March",
      "img": "nissanmarch.png"
    },
    {
      "lat": 19.410842,
      "lon": -99.175837,
      "car": "Audi A1",
      "img": "audia1.png"
    },
    {
      "lat": 19.417637,
      "lon": -99.178993,
      "car": "Nissan Leaf",
      "img": "nissanleaf.png"
    },
    {
      "lat": 19.426289,
      "lon": -99.178188,
      "car": "Nissan March",
      "img": "nissanmarch.png"
    },
    {
      "lat": 19.429691,
      "lon": -99.162658,
      "car": "Nissan Leaf",
      "img": "nissanleaf.png"
    },
    {
      "lat": 19.431674,
      "lon": -99.165174,
      "car": "Toyota Prius",
      "img": "toyotaprius.png"
    },
    {
      "lat": 19.431750,
      "lon": -99.165076,
      "car": "Nissan March",
      "img": "nissanmarch.png"
    },
    {
      "lat": 19.438496,
      "lon": -99.203745,
      "car": "Toyota Prius",
      "img": "toyotaprius.png"
    },
    {
      "lat": 19.441233,
      "lon": -99.204995,
      "car": "Nissan March",
      "img": "nissanmarch.png"
    },
    {
      "lat": 19.442312,
      "lon": -99.202847,
      "car": "Toyota Prius",
      "img": "toyotaprius.png"
    },
  ];
  $scope.stands = [];
  for(x = 0; x < $scope.carrot.length; x++){
    var stand = {};
    stand.coordinates = $scope.carrot[x].lat + ',' + $scope.carrot[x].lon;
    stand.marker = 'img/cars/' + $scope.carrot[x].img;
    $scope.stands.push(stand);
  }
  $scope.centerChange = function(stand){
    $scope.center = '[' + stand.coordinates + ']';
  };
  $scope.getDirections = function(station){
    var posOptions = {timeout: 10000, enableHighAccuracy: false};
    $cordovaGeolocation
      .getCurrentPosition(posOptions)
      .then(function (position) {
        var source  = [position.coords.latitude, position.coords.longitude];
        var dest = [station.lat, station.lon];
        launchnavigator.navigate(dest, source);
      }, function(err) {
        $cordovaToast.showLongBottom('Problem With Gps');
      });
  };
});
