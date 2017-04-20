/**
 * Created by Frank on 14/04/2017.
 */
let SUCCESS = 1;
let ERROR = -1;

const TYPE_TEST =  "TEST";
const TEST_UART = "TEST_UART";
const TEST_PPS = "TEST_PPS";
const TEST_ADC = "TEST_ADC";
const TEST_RTC = "TEST_RTC";
const TEST_SYNC = "TEST_SYNC";

const TYPE_MAIN =  "MAIN";
/*process*/
const PUT_LOCATION = "PUT_LOCATION_GPS";
const PUT_RTC_DATE = "PUT_RTC_DATEHOUR";
const PUT_SPS = "PUT_SPS";
const ALERTS = "ALERTS_ERROR";
const UPLOAD_FILES = "UPLOAD_FILES";
const REAL_TIME = "REAL_TIME";


/*Tipo de componentes*/
const GPS = "GPS";
const PPS = "PPS";
const RTC = "RTC";
const SYNC = "SYNC";
const ADC = "ADC";
const ACC = "ACC";
const BAT = "BAT";
const WIFI = "WIFI";

const portSocket = 4001;

let net = require('net');
let socketClient = require('./socketIoManager');
let components = require('./components');
const config = require('../config');
let socketServer = net.createServer( function (socket) {

    console.log("cliente conectado");

    socket.on('close', function (){
        console.log('cliente desconectado');
    });

    socket.on('data', function (data) {
        data = data.toString();

        try {
            let json = JSON.parse(data);
            //console.log(json);
            switch (json.type) {
                case TYPE_TEST:
                    doEmitTestResponse(json.msg, json.last);
                    break;
                case TYPE_MAIN:
                    console.log(json.msg);
                    switch (json.process){
                        case PUT_LOCATION:
                            putLocation();
                            break;
                        case PUT_RTC_DATE:
                            putRTC();
                            break;
                        case PUT_SPS:
                            putSPS();
                            break;
                        case UPLOAD_FILES:
                            uploadFiles(json.msg);
                            break;
                        case ALERTS:
                            doEmitAlertError(json.msg,json.component);
                            break;
                        case REAL_TIME:
                            console.log("CASE REAL_TIME");
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
        catch (err){
            console.log(err)
        }

    });

});

socketServer.listen(portSocket, function () {
    console.log('Servidor de net-socket escuchando');
});

function doEmitTestResponse(msg, last) {
    if (config.token !== ""){
        let sendJson = `{"token": "${config.token}", "data": "${msg}", "last" : ${last} }`;
        console.log("emit testResponse");
        socketClient.socket.emit('testResponse',sendJson, function(resp, data) {
            console.log('respuesta del servidor' + resp);
            console.log(resp.code);
        });
    }
}

function doEmitAlertError(msg, component) {
    if (config.token !== ""){
        let sendJson = `{"token": "${config.token}", "data": "${msg}", "component" : ${component} }`;
        console.log("emit request error");
        socketClient.socket.emit('requestError',sendJson, function(resp, data) {
            console.log('respuesta del servidor' + resp);
            console.log(resp.code);
        });
    }
}

function putLocation () {
    components.putLocation().then(function (data) {
        if (data.code === ERROR) {
            console.log("error en putLocation");
        }
        console.log(data);
    });
}

function putRTC () {
    components.putRTC().then(function (data) {
        if (data.code === ERROR) {
            console.log("error en putRTC");
        }
        console.log(data);
    });
}

function putSPS () {
    components.putSPS().then(function (data) {
        if (data.code === ERROR) {
            console.log("error en putSPS");
        }
        console.log(data);
    });
}

function uploadFiles (dir_file) {

    components.uploadFilesToServer(dir_file).then(function (data) {
        if (data.code === ERROR) {
            console.log("error en uploadFiles");
        }
        console.log(data);
    });
}


function realTime(json){

     if (config.token !== ""){
         console.log("REAL_TIME TOKEN");
         if (config.realTime) {
             console.log("REAL_TIME realTime");
             //console.log()

             if(config.Axis === '0'){
                 let sendJson = `{"token": "${config.token}", "data": { "x":[${json.x}], "y" : [${json.y}], "z" : [${json.z}] }}`;
                 console.log(sendJson); 
                 emitDataRealTime(sendJson);
             }
             else if(config.Axis === "BH1"){
                 let sendJson = `{"token": "${config.token}", "data": { "x":[${json.y}] }}`;
                 console.log(sendJson);
                 emitDataRealTime(sendJson);
             }
             else if(config.Axis === "BH2"){
                 let sendJson = `{"token": "${config.token}", "data": { "y":[${json.y}] }}`;
                 console.log(sendJson);
                 emitDataRealTime(sendJson);
             }
             else if(config.Axis === "BHZ"){
                 let sendJson = `{"token": "${config.token}", "data": { "z":[${json.z}] }}`;
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