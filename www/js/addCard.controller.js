var app = angular.module('addCard.controller', []);
app.controller('AddCardCtrl', function($scope, $cordovaCamera, $stateParams, $ionicPopup, $cordovaGeolocation, $cordovaSocialSharing, $cordovaToast){
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
  $scope.sending = false;
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
      quality: 40,
      destinationType: Camera.DestinationType.DATA_URL,
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
      imageBase64 = imageData;
      $cordovaToast.showLongBottom('Image Added').then(function(success) {
      }, function (error) {
      });
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
  var newCardUpdate = function(cardData, user, tweet){
    var newPostKey = firebase.database().ref().child('cards').push().key;
    var updates = {};
    updates['/users/' + user.uid + '/posts/' + newPostKey] = cardData;
    updates['/cards/' + $stateParams.type + '/' + $stateParams.routeId + '/' + $stateParams.tripId + '/' + newPostKey] = cardData;
    if(imageBase64.length > 1){
      cardData.image = true;
      updates['/cards/images/' + newPostKey] = imageBase64;
    }
    firebase.database().ref().update(updates).then(function(done){
      $scope.sending = false;
      postedAlert();
      if(tweet){
        $cordovaSocialSharing
          .shareViaTwitter(cardData.description, cardData.image)
          .then(function(result) {
            $cordovaToast.showLongBottom('Shared via Twitter').then(function(success) {
            // success
            }, function (error) {
              // error
            });
          }, function(err) {
            $cordovaToast.showLongBottom('Some error occured with Twitter').then(function(success) {
            // success
            }, function (error) {
              // error
            });
          });
      }
    });
  };
  $scope.post = function(title, description, addLocation, tweet){
    $scope.sending = true;
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
    if(addLocation){
      console.log("getting location");
      var posOptions = {timeout: 10000, enableHighAccuracy: false};
      $cordovaGeolocation
        .getCurrentPosition(posOptions)
        .then(function (position) {
          console.log("got location");
          cardData.location.lat  = position.coords.latitude;
          cardData.location.lon = position.coords.longitude;
          console.log(position);
          newCardUpdate(cardData, user, tweet);
        }, function(err) {
          noLocation();
          newCardUpdate(cardData, user, tweet);
        });
    }
    else{
      newCardUpdate(cardData, user, tweet);
    }
  };
});
