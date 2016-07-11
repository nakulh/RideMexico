var app = angular.module('addCard.controller', []);
app.controller('AddCardCtrl', function($scope, $cordovaCamera, $stateParams, $ionicPopup){
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
      popoverOptions: CameraPopoverOptions,
      saveToPhotoAlbum: true,
	    correctOrientation:true
    };
    $cordovaCamera.getPicture(options).then(function(imageData) {
      var image = document.getElementById('myImage');
      image.src = "data:image/jpeg;base64," + imageData;
    }, function(err) {
      console.log("i cant");
    });
  };
  $scope.description = "";
  $scope.title = "";
  $scope.addLocation = false;
  var postedAlert = function() {
     var alertPopup = $ionicPopup.alert({
       title: 'Done',
       template: 'Your card has been sent'
     });
  };
  $scope.post = function(title, description){
    $scope.title = title;
    $scope.description = description;
    if($scope.addLocation){
      // TODO: getlocation()
    }
    if($stateParams.tripId == "x")
      $stateParams.tripId = "";
    var cardData = {
      title: $scope.title,
      description: $scope.description,
      location: "coordinates",
      emotions: $scope.emotion,
      image: "imageData",
      route: $stateParams.routeId,
      trip: $stateParams.tripId
    };
    var user = firebase.auth().currentUser;
    var id = user.uid;
    var newPostKey = firebase.database().ref().child('cards').push().key;
    var updates = {};
    updates['/users/' + id + '/posts/' + newPostKey] = cardData;
    updates['/cards/' + $stateParams.type + '/' + $stateParams.routeId + '/' + $stateParams.tripId + '/' + newPostKey] = cardData;
    firebase.database().ref().update(updates).then();
    postedAlert();
  };
});
