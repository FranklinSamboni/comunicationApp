/**
 * Created by Frank on 14/04/2017.
 */

let SUCCESS = 1;
let ERROR = -1;

const URL_SOCKET = "https://socket.plataformamec.com/";

const io = require('socket.io-client');
const exec = require('child_process').exec;
let socket = io.connect(URL_SOCKET);

let tokenAuth = "";

socket.on('connect', function () {
    console.log("socket connected");

    socket.emit('register', '{ "serial": "Q2SW4ER5T6" }', function(resp, data) {
        resp = JSON.parse(resp);
        console.log("data: " + data);
        console.log('respuesta del servidor: ' + resp);
        console.log(resp.code);
        this.tokenAuth = resp.data.token;
        console.log("tokenAuth es_: " + tokenAuth);
    });
});

socket.on('requestTest', function (data) {
    data = JSON.parse(data);
    console.log("requestTest data" + data);
    //console.log("requestTest fn" + fn);
    switch (data.component){
        case "GPS":
            if(data.type === "GPS"){
                fileExecute("").then(function (data) {
                    console.log(data);
                });
            }
            else if(data.type == "PPS"){

            }

            break;
        case "RTC":
            break;
        case "ADC":
            break;
        case "ACC":
            break;
        case "BAT":
            break;
        case "WIFI":
            break;
        default:
            console.log("Error");
            console.log(data);
            break;
    }


    //exec(`/home/debian/Sensor-IOT/SensorIoT/tests/testGps ${path_file}`,{maxBuffer: 1024 * 50000}, function (err, stdout, stderr) {

});

function fileExecute(path) {

    return new Promise(function (fullfill) {
        exec(`/home/debian/Sensor-IOT/SensorIoT/tests/testGps U`,{maxBuffer: 1024 * 50000}, function (err, stdout, stderr) {
            console.log("dentro exec err: " + err);
            console.log("dentro stdout err: " + stdout);
            console.log("dentro stderr err: " + stderr);

            if(err) return fullfill({code:ERROR, msg: err});

        })
    });

}

module.exports = {
    token: tokenAuth,
    socket: socket
};
//module.exports = socket;

//socket.emit('private message', { user: 'YOO', msg: 'MENSAJE 1' });