/**
 * Created by Frank on 14/04/2017.
 */

let express = require('express');
let socketApp = express();

console.log("express - socketApp");

socketApp.on('connection', function () {
    console.log('client conectado');
});

socketApp.on('close', function (){
    console.log('client disconnected');
});

socketApp.on('data', function (data) {
    data = data.toString();
    console.log('Client sended:  '+data);
    //connection.write("Response");
    //console.log('Sended responst to client');
    //connection.end();
    //console.log('Disconnected the client.');
});
