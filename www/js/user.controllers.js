var app = angular.module('User.controllers', []);
app.controller('UserCtrl', function($scope, $ionicPopup){
  var registered = function() {
     var alertPopup = $ionicPopup.alert({
       title: 'Registeration Complete',
       template: 'You have been logged in'
     });
    alertPopup.then(function(res) {
      console.log('Thank you for not eating my delicious ice cream cone');
    });
  };
  var formError = function(msg){
    var alertPopup = $ionicPopup.alert({
      title: 'Watch your inputs!',
      template: msg
    });
   alertPopup.then(function(res) {
     console.log('Thank you for not eating my delicious ice cream cone');
   });
  };
  var signedOut = function(msg){
    var alertPopup = $ionicPopup.alert({
      title: 'Success',
      template: 'You have signed out'
    });
   alertPopup.then(function(res) {
     console.log('Thank you for not eating my delicious ice cream cone');
   });
  };
  var createUserInDb = function(id, fullname){
    firebase.database().ref('users/' + id).set({
      posts: {},
      favorites: [],
      fullname: fullname
    });
  };

  firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    $scope.user = user;
    $scope.vid = true;
  } else {
    $scope.vid = false;
    }
  });

  $scope.initLogin = function(email, password){
    firebase.auth().signInWithEmailAndPassword(email, password).then(function(user){
      $scope.user = firebase.auth().currentUser;
      $scope.vid = true;
      $scope.$apply();
    })
    .catch(function(error) {
      formError(error.message);
    });
  };

  $scope.initRegister = function(fullname, username, email, password){
    firebase.auth().createUserWithEmailAndPassword(email, password).then(function(user) {
    if(user){
      user.updateProfile({
        displayName: username,
      }).then(function() {
        $scope.user = firebase.auth().currentUser;
        createUserInDb(user.uid, fullname);
        $scope.vid = true;
        registered();
      }, function(error) {
      });
    }
  }).catch(function(err){
      console.log(err);
      formError(err.message);
    });
  };

  $scope.logout = function(){
    firebase.auth().signOut().then(function() {
      $scope.user = false;
      signedOut();
    }, function(error) {
      console.log(err);
    });
  };
});