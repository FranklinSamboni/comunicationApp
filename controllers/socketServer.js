/**
 * Created by Frank on 14/04/2017.
 */

const UART = "UART";
const PPS = "PPS";
const ADC = "ADC";
const RTC = "RTC";

const ALERTS = "ALERTS";
const REAL_TIME = "REAL_TIME";

const portSocket = 4001;

let net = require('net');
let socketClient = require('./socketIoManager');
const config = require('../config');
let socketServer = net.createServer( function (socket) {

    console.log("cliente conectado");

    socket.on('close', function (){
        console.log('client disconnected');
    });

    socket.on('data', function (data) {
        data = data.toString();
        //console.log(data);
        let json = JSON.parse(data);

 /*       switch(json.component){
            case UART:
                break;
            case PPS:
                break;
            case ADC:
                break;
            case RTC:
                break;
             default:
                break;

        }
*/

        if(json.component === UART){

            if (config.token !== ""){
                let sendJson = `{"token": "${config.token}", "msg": "${json.msg}", "last" : ${json.last} }`;
                socketClient.socket.emit('testResponse',sendJson, function(resp, data) {

                    console.log('respuesta del servidor' + resp);
                    console.log(resp.code);
                });
            }
        }
        else if(json.component === PPS){
            console.log(json.msg);
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