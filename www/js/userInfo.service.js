var app = angular.module('info.service', []);
app.factory('infoService', function($http, $q){
  var self = {};
  self.getLikesNumber = function(uid){
    var d = $q.defer();
    self.totalLikes = 0;
    firebase.database().ref('/users/' + uid + '/metro/like').once('value').then(function(likes){
      console.log(likes.val());
      if(likes.val()){
        for (var key in likes.val()) {
          if (likes.val().hasOwnProperty(key)) {
            self.totalLikes++;
          }
        }
      }
    });
    firebase.database().ref('/users/' + uid + '/train/like').once('value').then(function(likes){
      console.log(likes.val());
      if(likes.val()){
        for (var key in likes.val()) {
          if (likes.val().hasOwnProperty(key)) {
            self.totalLikes++;
          }
        }
      }
    });
    firebase.database().ref('/users/' + uid + '/bus/like/').once('value').then(function(likes){
      console.log(likes.val());
      if(likes.val()){
        for (var key in likes.val()) {
          if (likes.val().hasOwnProperty(key)) {
            for(var key2 in likes.val()[key]){
              if (likes.val()[key].hasOwnProperty(key2)) {
                self.totalLikes++;
              }
            }
          }
        }
      }
      d.resolve(true);
    });
    return d.promise;
  };
  self.getPostsNumber = function(uid){
    self.totalPosts = 0;
    var d = $q.defer();
    firebase.database().ref('/users/' + uid + '/posts/').once('value').then(function(posts){
      console.log(posts.val());
      for(var key in posts.val()){
        if(posts.val().hasOwnProperty(key)){
          self.totalPosts++;
        }
      }
      d.resolve(true);
    });
    return d.promise;
  };
  self.getUnmaintainedNumber = function(uid){
    var d = $q.defer();
    self.totalUnmaintained = 0;
    firebase.database().ref('/users/' + uid + '/metro/unmaintained').once('value').then(function(unmaintained){
      console.log(unmaintained.val());
      if(unmaintained.val()){
        for (var key in unmaintained.val()) {
          if (unmaintained.val().hasOwnProperty(key)) {
            self.totalUnmaintained++;
          }
        }
      }
    });
    firebase.database().ref('/users/' + uid + '/train/unmaintained').once('value').then(function(unmaintained){
      console.log(unmaintained.val());
      if(unmaintained.val()){
        for (var key in unmaintained.val()) {
          if (unmaintained.val().hasOwnProperty(key)) {
            self.totalUnmaintained++;
          }
        }
      }
    });
    firebase.database().ref('/users/' + uid + '/bus/unmaintained/').once('value').then(function(unmaintained){
      console.log(unmaintained.val());
      if(unmaintained.val()){
        for (var key in unmaintained.val()) {
          if (unmaintained.val().hasOwnProperty(key)) {
            for(var key2 in unmaintained.val()[key]){
              if (unmaintained.val()[key].hasOwnProperty(key2)) {
                self.totalUnmaintained++;
              }
            }
          }
        }
      }
      d.resolve(true);
    });
    return d.promise;
  };
  self.getConjustedNumber = function(uid){
    var d = $q.defer();
    self.totalConjusted = 0;
    firebase.database().ref('/users/' + uid + '/metro/conjusted').once('value').then(function(conjusted){
      console.log(conjusted.val());
      if(conjusted.val()){
        for (var key in conjusted.val()) {
          if (conjusted.val().hasOwnProperty(key)) {
            self.totalConjusted++;
          }
        }
      }
    });
    firebase.database().ref('/users/' + uid + '/train/conjusted').once('value').then(function(conjusted){
      console.log(conjusted.val());
      if(conjusted.val()){
        for (var key in conjusted.val()) {
          if (conjusted.val().hasOwnProperty(key)) {
            self.totalConjusted++;
          }
        }
      }
    });
    firebase.database().ref('/users/' + uid + '/bus/conjusted/').once('value').then(function(conjusted){
      console.log(conjusted.val());
      if(conjusted.val()){
        for (var key in conjusted.val()) {
          if (conjusted.val().hasOwnProperty(key)) {
            for(var key2 in conjusted.val()[key]){
              if (conjusted.val()[key].hasOwnProperty(key2)) {
                self.totalConjusted++;
              }
            }
          }
        }
      }
      d.resolve(true);
    });
    return d.promise;
  };
  self.getLateNumber = function(uid){
    var d = $q.defer();
    self.totalLate = 0;
    firebase.database().ref('/users/' + uid + '/metro/late').once('value').then(function(late){
      console.log(late.val());
      if(late.val()){
        for (var key in late.val()) {
          if (late.val().hasOwnProperty(key)) {
            self.totalLate++;
          }
        }
      }
    });
    firebase.database().ref('/users/' + uid + '/train/late').once('value').then(function(late){
      console.log(late.val());
      if(late.val()){
        for (var key in late.val()) {
          if (late.val().hasOwnProperty(key)) {
            self.totalLate++;
          }
        }
      }
    });
    firebase.database().ref('/users/' + uid + '/bus/late/').once('value').then(function(late){
      console.log(late.val());
      if(late.val()){
        for (var key in late.val()) {
          if (late.val().hasOwnProperty(key)) {
            for(var key2 in late.val()[key]){
              if (late.val()[key].hasOwnProperty(key2)) {
                self.totalLate++;
              }
            }
          }
        }
      }
      d.resolve(true);
    });
    return d.promise;
  };
  return self;
});
