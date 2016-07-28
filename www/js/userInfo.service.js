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
  return self;
});
