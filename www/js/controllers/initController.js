/**
 * Created by jack on 15-8-14.
 */
angular.module('app.controllers')
    .controller('initController', function($scope, $interval,$timeout, $ionicModal,$rootScope) {
        $scope.socket=null;
        $scope.configdata=localStorage.configdata?JSON.parse(localStorage.configdata):{};

        console.log('initController');

        $ionicModal.fromTemplateUrl('templates/config.html', {
            scope: $scope
        }).then(function(modal) {
            $scope.configmodal = modal;
            $rootScope.$broadcast('initWebSocket', $scope);

        });

        //make config
        $scope.makeConfig=function(configdata){
            localStorage.configdata=JSON.stringify(configdata);
            $scope.configmodal.hide();
            window.location.reload();

        };




    });
