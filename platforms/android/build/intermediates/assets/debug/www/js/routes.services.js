var app = angular.module('routes.services',[]);

app.factory('RoutesService', function($http, $q){
    var self = {};
    self.loadRoutes = function(){
        var d = $q.defer();
        $http.get("./js/routes.json")
          .success(function success(data){
            d.resolve(data);
          })
          .error(function error(err){
            console.log(err);
          });
        return d.promise;
    };
    return self;
});
