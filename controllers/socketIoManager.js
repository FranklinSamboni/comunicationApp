/**
 * Created by Frank on 14/04/2017.
 */

const URL_SOCKET = "https://socket.plataformamec.com/";

const io = require('socket.io-client');
const exec = require('child_process').exec;
let socket = io.connect(URL_SOCKET);

socket.on('connect', function () {
    console.log("socket connected");

    //exec(`/home/debian/Sensor-IOT/SensorIoT/tests/testGps ${path_file}`,{maxBuffer: 1024 * 50000}, function (err, stdout, stderr) {
    exec(`/home/debian/Sensor-IOT/SensorIoT/tests/testGps U`,{maxBuffer: 1024 * 50000}, function (err, stdout, stderr) {
        console.log("dentro exec err: " + err);
        console.log("dentro stdout err: " + stdout);
        console.log("dentro stderr err: " + stderr);

        /*if(err) return fullfill({hcode: 202, code: "003", msg: "Error", data: err});

        //console.log(stdout);
        fullfill({hcode: 202, code: "001", msg: date_file, data: stdout})*/
    })

    socket.emit('register', '{ "serial": "Q2SW4ER5T6" }', function(resp, data) {
        console.log('respuesta del servidor' + resp);
        console.log(resp.code);
    });
});

module.exports = socket;

//socket.emit('private message', { user: 'YOO', msg: 'MENSAJE 1' });