/**
 * Created by jack on 15-8-20.
 */
if(typeof(remoteloaded)=='undefined'){
    if(!localStorage.serverurl)localStorage.serverurl="http://199.199.4.21:3000/";
    var theResponse = window.prompt("服务地址",localStorage.serverurl);
    if(theResponse)localStorage.serverurl=theResponse;
    else  localStorage.serverurl="http://199.199.4.21:3000/";
    window.location.reload();
}
