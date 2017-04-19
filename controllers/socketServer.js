/**
 * Created by Frank on 14/04/2017.
 */


const TYPE_TEST =  "TEST";
const TEST_UART = "TEST_UART";
const TEST_PPS = "TEST_PPS";
const TEST_ADC = "TEST_ADC";
const TEST_RTC = "TEST_RTC";
const TEST_SYNC = "TEST_SYNC";

const TYPE_MAIN =  "MAIN";
const PUT_LOCATION = "PUT_LOCATION_GPS";
const PUT_RTC_DATE = "PUT_RTC_DATEHOUR";
const PUT_SPS = "PUT_SPS";
const ALERTS = "ALERTS_ERROR";
const REAL_TIME = "REAL_TIME";

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
            console.log(json);
            switch (json.type) {
                case TYPE_TEST:
                    doEmitTestResponse(json.msg, json.last);
                    break;
                case TYPE_MAIN:
                    console.log(json.msg);
                    switch (json.process){
                        case PUT_LOCATION:
                            break;
                        case PUT_RTC_DATE:
                            break;
                        case PUT_SPS:
                            break;
                        case ALERTS:
                            doEmitAlertError(json.msg,json.component);
                            break;
                        case REAL_TIME:
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
        let sendJson = `{"token": "${config.token}", "msg": "${msg}", "last" : ${last} }`;
        console.log("Antes del emit");
        socketClient.socket.emit('testResponse',sendJson, function(resp, data) {
            console.log('respuesta del servidor' + resp);
            console.log(resp.code);
        });
    }
}

function doEmitAlertError(msg, component) {
    if (config.token !== ""){
        let sendJson = `{"token": "${config.token}", "data": "${msg}", "component" : ${component} }`;
        console.log("Antes del emit");
        socketClient.socket.emit('requestError',sendJson, function(resp, data) {
            console.log('respuesta del servidor' + resp);
            console.log(resp.code);
        });
    }
}