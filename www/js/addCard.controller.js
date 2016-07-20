var app = angular.module('addCard.controller', []);
app.controller('AddCardCtrl', function($scope, $cordovaCamera, $stateParams, $ionicPopup, $cordovaGeolocation){
  $scope.emotion = {
    confused: 0,
    question:  0,
    vomit: 0,
    angry: 0,
    happy: 0,
    hurt: 0,
    like: 0,
    sad: 0,
    dislike: 0
  };
  var imageBase64 = "";
  $scope.description = "";
  $scope.title = "";
  $scope.addLocation = false;
  $scope.selectEmotion = function(emotion){
    $scope.emotion[emotion] = !$scope.emotion[emotion];
  };
  $scope.addPic = function(source){
    var sources = {
      camera: Camera.PictureSourceType.CAMERA,
      library: Camera.PictureSourceType.PHOTOLIBRARY
    };
    var options = {
      quality: 50,
      destinationType: Camera.DestinationType.FILE_URI,
      sourceType: sources[source],
      allowEdit: true,
      encodingType: Camera.EncodingType.JPEG,
      targetWidth: 170,
      targetHeight: 100,
      popoverOptions: Camera.PopoverOptions,
      saveToPhotoAlbum: true,
	    correctOrientation:true
    };
    $cordovaCamera.getPicture(options).then(function(imageData) {
      var image = document.getElementById('myImage');
      image.src = "data:image/jpeg;base64," + imageData;
      imageBase64 = imageData;
    }, function(err) {
      console.log("i cant");
    });
  };
  var postedAlert = function() {
     var alertPopup = $ionicPopup.alert({
       title: 'Done',
       template: 'Your card has been sent'
     });
  };
  var noLocation = function(){
    var alertPopup = $ionicPopup.alert({
      title: 'Error getting Location',
      template: 'Posting Without Location'
    });
  };
  var newCardUpdate = function(cardData, user){
    var newPostKey = firebase.database().ref().child('cards').push().key;
    var updates = {};
    console.log("2....");
    updates['/users/' + user.uid + '/posts/' + newPostKey] = cardData;
    updates['/cards/' + $stateParams.type + '/' + $stateParams.routeId + '/' + $stateParams.tripId + '/' + newPostKey] = cardData;
    if(imageBase64.length > 1){
      cardData.image = true;
      updates['/cards/images/' + newPostKey] = imageBase64;
    }
    firebase.database().ref().update(updates).then(function(done){
      postedAlert();
    });
  };
  $scope.post = function(title, description, addLocation){
    $scope.title = title;
    $scope.description = description;
    if($stateParams.tripId == "x")
      $stateParams.tripId = "";
    var user = firebase.auth().currentUser;
    var cardData = {
      title: $scope.title,
      description: $scope.description,
      location: {lat: false, lon: false},
      emotions: $scope.emotion,
      image: false,
      route: $stateParams.routeId,
      trip: $stateParams.tripId,
      user: user.displayName,
      date: new Date(),
      likes: 0,
      comments: {} // | date:'yyyy-MM-dd HH:mm:ss Z'
    };
    console.log("....");
    if(addLocation){
      console.log("getting location");
      var posOptions = {timeout: 5000, enableHighAccuracy: false};
      $cordovaGeolocation
        .getCurrentPosition(posOptions)
        .then(function (position) {
          console.log("got location");
          cardData.location.lat  = position.coords.latitude;
          cardData.location.lon = position.coords.longitude;
          console.log(position);
          newCardUpdate(cardData, user);
        }, function(err) {
          noLocation();
          newCardUpdate(cardData, user);
          console.log("no location");
        });
    }
    else{
      newCardUpdate(cardData, user);
    }
  };
});
