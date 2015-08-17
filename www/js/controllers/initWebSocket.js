/**
 * Created by jack on 15-8-14.
 */
angular.module('app.controllers')
    .run(function($rootScope,$timeout){
        //var hello = testFactory.Hello();
        console.log("hello");
        //console.log($rootScope);

        $rootScope.$on('initWebSocket', function (event, $scope) {
            //$scope.configmodal.show();
            var socket=null;

            var websocketInit=function(){
                var url=$scope.configdata.serverurl;
                var roomnum=$scope.configdata.roomnum;
                if(!url||url==""){
                    //Ext.Msg.alert('提示','服务地址为空');
                    $scope.configmodal.show();
                    return ;
                }
                if(!roomnum||roomnum==""){
                    //Ext.Msg.alert('提示','诊区为空');
                    $scope.configmodal.show();
                    return ;
                }

                url=url.replace(/(:\d+)/g,":3001");
                url=url.replace("http","ws");


                socket = new WebSocket(url);
                socket.onmessage = function(event) {
                    var res=JSON.parse(event.data);


                    $timeout(function(){
                        if(res.type=="callpatient"){

                            for(var i=0;i<$scope.data.length;i++){
                                if($scope.data[i].flag=="1"){
                                    $scope.data[i].flag="2";

                                }
                            }
                            $timeout(function(){
                                $scope.data=res.data;
                            },0);


                        }else if(res.type=="doctorlogin"){
                            for(var i=0;i<res.data.length;i++){
                                $scope.doctorinfo=res.data[i];

                            }

                        }else if(res.type=="changeroom"){
                            $scope.configdata.roomnum=res.data.newno;
                            $scope.configdata.roomname=res.data.newname;
                            localStorage.configdata=JSON.stringify($scope.configdata);
                            window.location.reload();

                        }
                    },0);

                };
                socket.onclose = function(event) {
                    $timeout(function(){
                        websocketInit();
                    },3000);
                };

                socket.onopen = function() {

                    socket.send(JSON.stringify({
                        type:"roomscreen",
                        content: roomnum
                    }));
                };


            }
            //init websocket;
            websocketInit();
        });
    })
