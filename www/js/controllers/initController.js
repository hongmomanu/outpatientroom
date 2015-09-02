/**
 * Created by jack on 15-8-14.
 */
var remoteloaded=true;
angular.module('app.controllers')
    .controller('initController', function($scope, $interval,$timeout, $ionicModal,$rootScope) {
        $scope.socket=null;
        $scope.data=[];
        $scope.servertime = 100;
        $scope.configdata=localStorage.configdata?JSON.parse(localStorage.configdata):{};
        if (!localStorage.showlines)localStorage.showlines = 5;

        console.log('initController');
        $scope.maketimerotate=function(){
            var now=new Date();
            now.setTime(now.getTime()+$scope.servertime);
            var currentTime = now;
            var hours = currentTime.getHours();
            var minutes = currentTime.getMinutes();
            var seconds = currentTime.getSeconds();
            var minstr=minutes*6+seconds/10;
            var hourstr=(hours>=12?(hours-12):hours)*30+minutes/2;
            //var hourstr=hours*30+minutes/2;

            var secondstr=seconds*6;
            jQuery('.minutes-hand').css("-webkit-transform","rotate("+minstr+"deg)");
            jQuery('.hours-hand').css("-webkit-transform","rotate("+hourstr+"deg)");
            jQuery('.seconds-hand').css("-webkit-transform","rotate("+secondstr+"deg)");
            //jQuery('.seconds-hand').css('@keyframes','seconds{to {transform:rotate(480deg)}}');
            jQuery.keyframe.define({name: 'seconds',to: {
                'transform': 'rotate('+ (360+secondstr)+'deg)'
            }});
            jQuery.keyframe.define({name: 'hours',to: {
                'transform': 'rotate('+(360+hourstr)+'deg)'
            }});
            jQuery.keyframe.define({name: 'minutes',to: {
                'transform': 'rotate('+(360+minstr)+'deg)'
            }});
            //jQuery('.hours-hand').css("-webkit-transform","rotate("+hourstr+"deg)");


        };
        //maketimerotate();

        $ionicModal.fromTemplateUrl(localStorage.serverurl+'app/room/templates/config.html?t='+(new Date().getTime()), {
            scope: $scope
        }).then(function(modal) {
            $scope.configmodal = modal;
            $rootScope.$broadcast('initWebSocket', $scope);

        });

        //make config
        $scope.makeConfig=function(configdata){
            localStorage.configdata=JSON.stringify(configdata);
            localStorage.serverurl=configdata.serverurl;
            $scope.configmodal.hide();
            window.location.reload();

        };




    });
