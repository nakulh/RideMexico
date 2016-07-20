var app = angular.module('Card.service', []);
app.factory('cardService', function($q){
  self = {};
  self.getTags = function(type, routeId, tripId){
    d = $q.defer();
    firebase.database().ref('/'+ type + '/' + routeId + '/' + tripId + '/tags/').once('value').then(function(value) {
      self.tags = {};
      if(value.val() === null){
        self.tags.conjusted = 0;
        self.tags.like = 0;
        self.tags.late = 0;
        self.tags.unmaintained = 0;
      }
      else{
        self.tags = value.val();
      }
      if(!self.tags.conjusted){
        self.tags.conjusted = 0;
      }
      if(!self.tags.like){
        self.tags.like = 0;
      }
      if(!self.tags.late){
        self.tags.late = 0;
      }
      if(!self.tags.unmaintained){
        self.tags.unmaintained = 0;
      }
      console.log(self.tags);
      d.resolve();
      return d.promise;
    });
  };

  self.tagsEdit = function(type, tag){
    d = q.defer();
    console.log(tag);
    firebase.database().ref('/'+ type + '/' + $stateParams.routeId + '/tags/' + tag).once('value').then(function(value) {
      var updates = {};
      var newValue = 1;
      console.log(value.val());
      if(value.val() !== null)
        newValue = value.val() + 1;
      updates['/'+ type + '/' + $stateParams.routeId + '/tags/' + tag] = newValue;
      firebase.database().ref().update(updates).then(function(done){
        console.log(newValue);
        d.resolve();
        return d.promise;
      });
    });
  };

  self.likeCard = function(type, routeId, tripId, indx, currkey, card){
   d = q.defer();
    var user = firebase.auth().currentUser;
    firebase.database().ref('/users/'+ user.uid + "/likes/" + currKey).once('value').then(function(like) {
      if(!like.val()){
        var update = {};
        update['/users/'+ user.uid + "/likes/" + currKey] = {value: true};
        firebase.database().ref().update(update).then(function(done){
          update = {};
          var l = ++card.likes;
          //console.log($scope.cards[indx]);
          update['/cards/'+ type + '/' + routeId + '/' + tripId + '/' + currKey + '/likes'] = l;
          firebase.database().ref().update(update).then(function(done){
            console.log("liked");
            d.resolve();
            return d.promise;
            //$scope.$apply();
          });
        });
      }
    });
  };
  return self;
});
