/**
 * Created by Frank on 14/04/2017.
 */

const UART = "UART";
const PPS = "PPS";
const ADC = "ADC";
const RTC = "RTC";
const SYNC = "SYNC";

const ALERTS = "ALERTS";
const REAL_TIME = "REAL_TIME";

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
            switch (json.component) {
                case UART:
                    doEmitTestResponse(json.msg, json.last);
                    break;
                case PPS:
                    doEmitTestResponse(json.msg, json.last);
                    break;
                case ADC:
                    doEmitTestResponse(json.msg, json.last);
                    break;
                case RTC:
                    doEmitTestResponse(json.msg, json.last);
                case SYNC:
                    doEmitTestResponse(json.msg, json.last);
                    break;
                default:
                    break;

            }
        }
        catch (err){
            console.log(err)
        }

        //connection.write("Response");
        //console.log('Sended responst to client');
        //connection.end();
        //console.log('Disconnected the client.');
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