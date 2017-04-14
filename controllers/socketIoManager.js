/**
 * Created by Frank on 14/04/2017.
 */

const URL_SOCKET = "https://socket.plataformamec.com/";

let io = require('socket.io-client');

let socket = io.connect(URL_SOCKET);

socket.on('connect', function () {
    console.log("socket connected");

    socket.emit('register', '{ "serial": "Q2SW4ER5T6" }', function(resp, data) {
        console.log('respuesta del servidor' + resp);
        console.log(resp.code);
    });
});

module.exports = socket;

//socket.emit('private message', { user: 'YOO', msg: 'MENSAJE 1' });