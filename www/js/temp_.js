var cardKeys = [];
$scope.cards = [];
firebase.database().ref('/metro/'+ $stateParams.routeId + '/tags/').once('value').then(function(value) {
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
  for(var y = 0; y < $scope.cards.length; y++){
    //getImage(y);
  }
//  $scope.$apply();
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
        update['/cards/metro/' + $stateParams.routeId + '/' + currKey + '/likes'] = l;
        firebase.database().ref().update(update).then(function(done){
          console.log("liked");
          $scope.$apply();
        });
      });
    }
  });
};










var notLoggedIn = function(){
  var alertPopup = $ionicPopup.alert({
    title: 'Ouchie !',
    template: 'You must be logged in to use this function'
  });
};
$scope.addCard = function($event) {
   if (firebase.auth().currentUser) {
      var path = "/app/addcard/" + $stateParams.routeId + "/x/" + "metro";
      $location.path(path);
    } else {
      notLoggedIn();
    }
};
