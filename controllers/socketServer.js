/**
 * Created by Frank on 14/04/2017.
 */

const portSocket = 4001;

let net = require('net');

let socketServer = net.createServer( function (socket) {

    console.log("cliente conectado");

    socket.on('close', function (){
        console.log('client disconnected');
    });

    socket.on('data', function (data) {
        data = data.toString();
        console.log('Client sended:  '+data);
        //connection.write("Response");
        //console.log('Sended responst to client');
        //connection.end();
        //console.log('Disconnected the client.');
    });

});



socketServer.listen(portSocket, function () {
    console.log('Servidor de net-socket escuchando');
});