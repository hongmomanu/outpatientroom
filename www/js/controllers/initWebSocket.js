/**
 * Created by jack on 15-8-14.
 */
angular.module('app.controllers')
    .run(function($rootScope,$timeout){
        //var hello = testFactory.Hello();
        //console.log("hello");
        //console.log($rootScope);

        $rootScope.$on('initWebSocket', function (event, $scope) {
            //$scope.configmodal.show();
            var socket=null;

            var makeautostart=function(){
                try{
                    cordova.plugins.autoStart.enable();
                }catch(e){

                }finally{

                }
            }
            makeautostart();


            var removeListItem=function(hzxh){
                for(var i=0;i<$scope.data.length;i++){
                    if($scope.data[i].hzxh==hzxh){
                        $scope.data[i].status="3";
                        $timeout(function(){
                            $scope.data.splice(i,1);
                        },0);

                        break;
                    }
                }
            };

            var claerscreen=function(){

                for(var i=0;i<$scope.data.length;i++){
                    $scope.data[i].status="3";
                }

                $timeout(function(){
                    $scope.data=[];
                },0);
            }

            var websocketInit=function(){

                if(!$scope.configdata.serverurl)$scope.configdata.serverurl=localStorage.serverurl;

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
                            /**/
                            $timeout(function(){
                                for(var i=0;i<res.data.length;i++){
                                    if(res.data[i].status=='4'){
                                        removeListItem(res.data[i].hzxh);
                                        (function(item){
                                            $timeout(function(){
                                                $scope.data.splice(0, 0, item);
                                            },30);
                                        })(res.data[i]);

                                        //$scope.data[0]=res.data[i];
                                    }else if(res.data[i].status=='2'||res.data[i].status=='6'){
                                        //$scope.data.push(res.data[i]);
                                        removeListItem(res.data[i].hzxh);

                                    }else if(res.data[i].status=='3'){
                                        $scope.data.push(res.data[i]);
                                    }
                                }
                                //$scope.data=res.data;
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

                        }else if(res.type=='freshsystem'){
                            window.location.href="";
                        }else if (res.type=='clearscreen'){

                            claerscreen();
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
