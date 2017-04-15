/**
 * Created by Frank on 14/04/2017.
 */

const UART = "UART";
const PPS = "PPP";

const portSocket = 4001;

let net = require('net');
let socketClient = require('./socketIoManager');

let socketServer = net.createServer( function (socket) {

    console.log("cliente conectado");

    socket.on('close', function (){
        console.log('client disconnected');
    });

    socket.on('data', function (data) {
        data = data.toString();
        //console.log(data);
        let json = JSON.parse(data);
        if(json.component === UART){
            console.log(json.msg);

            console.log("antes de emit " + socketClient.token);
            if (socketClient.token !== ""){
                console.log("do emit " + socketClient.token);
                socketClient.socket.emit('testResponse',`{"token": "${socketClient.token}", "msg": "${json.msg}" }`, function(resp, data) {
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