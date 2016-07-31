var app = angular.module('User.controllers', ['info.service']);
app.controller('UserCtrl', function($scope, $ionicPopup, $cordovaToast, infoService){

  var registered = function() {
     var alertPopup = $ionicPopup.alert({
       title: 'Registeration Complete',
       template: 'You have been logged in'
     });
  };
  var formError = function(msg){
    var alertPopup = $ionicPopup.alert({
      title: 'Watch your inputs!',
      template: msg
    });
  };
  var signedOut = function(msg){
    var alertPopup = $ionicPopup.alert({
      title: 'Success',
      template: 'You have signed out'
    });
  };
  var createUserInDb = function(id, fullname){
    firebase.database().ref('users/' + id).set({
      posts: {},
      cards: 0,
      late: 0,
      conjusted: 0,
      unmaintained: 0,
      favorites: [],
      fullname: fullname
    });
  };

  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      $scope.user = user;
      $scope.vid = true;
      uid = user.uid;
      $scope.username = user.displayName;
      $scope.gettingLikes = true;
      infoService.getLikesNumber(uid).then(function(data){
        $scope.totalLikes = infoService.totalLikes;
        $scope.gettingLikes = false;
      });
      $scope.gettingPosts = true;
      infoService.getPostsNumber(uid).then(function(data){
        $scope.totalPosts = infoService.totalPosts;
        $scope.gettingPosts = false;
      });
      $scope.gettingUnmaintained = true;
      infoService.getUnmaintainedNumber(uid).then(function(data){
        $scope.totalUnmaintained= infoService.totalUnmaintained;
        $scope.gettingUnmaintained = false;
      });
      $scope.gettingConjusted = true;
      infoService.getConjustedNumber(uid).then(function(data){
        $scope.totalConjusted = infoService.totalConjusted;
        $scope.gettingConjusted = false;
      });
      $scope.gettingLate = true;
      infoService.getLateNumber(uid).then(function(data){
        $scope.totalLate = infoService.totalLate;
        $scope.gettingLate = false;
      });
    }
    else {
      $scope.vid = false;
    }
  });

  $scope.initLogin = function(email, password){
    firebase.auth().signInWithEmailAndPassword(email, password).then(function(user){
      $scope.user = firebase.auth().currentUser;
      $scope.vid = true;
      $scope.$apply();
      $cordovaToast.showLongBottom('Logged In');
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
  $scope.emailReset = false;
  $scope.toggleEmailReset = function(){
    $scope.emailReset = !$scope.emailReset;
  };
  $scope.resetEmail = function(email){
    var user = firebase.auth().currentUser;
    user.updateEmail(email).then(function() {
      $cordovaToast.showLongBottom('Email Update Successful!');
    }, function(error) {
      console.log(error);
      $cordovaToast.showLongBottom(error.message);
    });
  };
  $scope.passwordReset = false;
  $scope.togglePasswordReset = function(){
    $scope.passwordReset = !$scope.passwordReset;
  };
  $scope.resetPassword = function(){
    var user = firebase.auth().currentUser;
    var auth = firebase.auth();
    email = user.email;
    auth.sendPasswordResetEmail(email).then(function() {
      $cordovaToast.showLongBottom("Email has been sent").then(function(){
        $cordovaToast.showLongBottom("Try Logging out and in again");
      });
    }, function(error) {
      $cordovaToast.showLongBottom(error.message).then(function(){
        $cordovaToast.showLongBottom("Try Logging out and in again");
      });
    });
  };
});
