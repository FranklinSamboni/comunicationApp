/**
 * Created by Frank on 14/04/2017.
 */

const portSocket = 4001;

let net = require('net');
let socketClient = require('./socketIoManager');
let components = require('./components');
const config = require('../config');
const uploadFile = require('./uploadFiles');
let socketServer = net.createServer( function (socket) {

    console.log("cliente conectado");

    socket.on('close', function (){
        console.log('cliente desconectado');
    });

    socket.on('data', function (data) {
        data = data.toString();

        try {
            //console.log("el data recibido en socekt server es: " + data);
            if(data !== "\r\n"){
                let json = JSON.parse(data);
                //console.log(json);
                switch (json.type) {
                    case config.TYPE_TEST:
                        doEmitTestResponse(json.msg, json.last);
                        break;
                    case config.TYPE_MAIN:
                        //console.log("mensaje desde C " + json.msg);
                        switch (json.process){
                            case config.PUT_LOCATION:
                                putLocation();
                                break;
                            case config.PUT_RTC_DATE:
                                //socketClient.closeMainProgram();
                                putRTC();
                                break;
                            case config.PUT_SPS:
                                putSPS();
                                break;
                            case config.UPLOAD_FILES:
                                uploadFiles(json.msg);
                                break;
                            case config.ALERTS:
                                doEmitAlertError(json.msg,json.component);
                                break;
                            case config.REAL_TIME:
                                //console.log("CASE REAL_TIME");
                                realTime(json);
                                break;
                            default:
                                break;
                        }

                        break;
                    default:
                        break;

                }
            }
        }
        catch (err){
            console.log(err)
        }

    });

});

socketServer.listen(portSocket, function () {
    console.log('Servidor de net-socket escuchando');
    //socketClient.runMainProgram();
});

function doEmitTestResponse(msg, last) {
    if (config.SOCKET_TOKEN !== ""){
        let sendJson = `{"token": "${config.SOCKET_TOKEN}", "data": "${msg}", "last" : ${last} }`;
        console.log("emit testResponse");
        socketClient.socket.emit('testResponse',sendJson, function(resp, data) {
            console.log('respuesta del servidor' + resp);
            console.log(resp.code);
        });
        if(last){
           // socketClient.runMainProgram();
        }
    }
}

function doEmitAlertError(msg, component) {
    if (config.token !== ""){
        let sendJson = `{"token": "${config.SOCKET_TOKEN}", "data": "${msg}", "component" : "${component}" }`;
        console.log("emit request error  " + msg + "   " + component);
        socketClient.socket.emit('requestError',sendJson, function(resp, data) {
            console.log('respuesta del servidor' + resp);
            console.log(resp.code);
        });
    }
}

function putLocation () {
    components.putLocation(config.REST_TOKEN).then(function (data) {
        if (data.code === config.ERROR) {
            console.log("error en putLocation");
        }
        console.log(data);
    });
}

function putRTC () {
    components.putRTC(config.REST_TOKEN).then(function (data) {
        if (data.code === config.ERROR) {
            console.log("error en putRTC");
        }
        console.log(data);
    });
}

function putSPS () {
    components.putSPS(config.REST_TOKEN).then(function (data) {
        if (data.code === config.ERROR) {
            console.log("error en putSPS");
        }
        console.log(data);
    });
}

function uploadFiles (dir_file) {

    uploadFile.uploadFilesToServer(config.REST_TOKEN,dir_file).then(function (data) {
        if (data.code === config.ERROR) {
            console.log("error en uploadFiles");
        }
        console.log(data);
    });
}


function realTime(json){

     if (config.SOCKET_TOKEN !== ""){
         //console.log("REAL_TIME TOKEN");
         if (config.ENABLE_REAL_TIME) {
             console.log("real Time active");

             if(config.AXIS === config.ALL_AXIS){
                 let sendJson = `{"token": "${config.SOCKET_TOKEN}", "data": { "x":[${json.x}], "y" : [${json.y}], "z" : [${json.z}] }}`;
                 console.log(sendJson);
                 emitDataRealTime(sendJson);
             }
             else if(config.AXIS === config.AXI_X){
                 let sendJson = `{"token": "${config.SOCKET_TOKEN}", "data": { "x":[${json.x}] }}`;
                 console.log(sendJson);
                 emitDataRealTime(sendJson);
             }
             else if(config.AXIS === config.AXI_Y){
                 let sendJson = `{"token": "${config.SOCKET_TOKEN}", "data": { "y":[${json.y}] }}`;
                 console.log(sendJson);
                 emitDataRealTime(sendJson);
             }
             else if(config.AXIS === config.AXI_Z){
                 let sendJson = `{"token": "${config.SOCKET_TOKEN}", "data": { "z":[${json.z}] }}`;
                 console.log(sendJson);
                 emitDataRealTime(sendJson);
             }

         }
     }
}

function emitDataRealTime(json) {
    console.log("emit real time");

    socketClient.socket.emit('responseRealTime', json, function (resp, data) {
        console.log('respuesta del servidor' + resp);
        console.log(resp.code);
    });
}