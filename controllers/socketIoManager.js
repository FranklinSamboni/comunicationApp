/**
 * Created by Frank on 14/04/2017.
 */

let SUCCESS = 1;
let ERROR = -1;

const URL_SOCKET = "https://socket.plataformamec.com/";
   
const io = require('socket.io-client');
const config = require('../config');
const exec = require('child_process').exec;

let socket = io.connect(URL_SOCKET);

socket.on('connect', function () {
    console.log("socket connected");

    socket.emit('register', '{ "serial": "Q2SW4ER5T6" }', function(resp, data) {
        resp = JSON.parse(resp);
        //console.log("data: " + data);
        //console.log('respuesta del register: ' + resp);
        console.log(resp.code);
        config.token = resp.data.token;
    });

    //fileExecuteMain();

    //closeProgram();
});

socket.on('disconnect', function () {
    console.log("socket io disconnect");
});

socket.on('requestTest', function (data) {
    data = JSON.parse(data);
    console.log("requestTest data" + data);
    //console.log("requestTest fn" + fn);
    switch (data.component){
        case "GPS":
            if(data.type === "GPS"){
                fileExecute(`/home/debian/Sensor-IOT/SensorIoT/tests/testGps U`).then(function (data) {
                    console.log(data);
                });
            }
            else if(data.type === "PPS"){
                fileExecute(`/home/debian/Sensor-IOT/SensorIoT/tests/testGps P`).then(function (data) {
                    console.log(data);
                });
            }

            break;
        case "RTC":
            if(data.type === "RTC"){
                fileExecute(`/home/debian/Sensor-IOT/SensorIoT/tests/testRtc I`).then(function (data) {
                    console.log(data);
                });
            }
            else if(data.type === "SYNC"){
                fileExecute(`/home/debian/Sensor-IOT/SensorIoT/tests/testRtc S`).then(function (data) {
                    console.log(data);
                });
            }
            break;
        case "ADC":
            fileExecute(`/home/debian/Sensor-IOT/SensorIoT/tests/testAdc`).then(function (data) {
                console.log(data);
            });
            break;
        case "ACC":
            break;
        case "BAT":
            break;
        case "WIFI":
            if (config.token !== ""){
                let last = true
                let sendJson = `{"token": "${config.token}", "msg": "Wifi funciona conrrectamente", "last" : ${last} }`;
                socketClient.socket.emit('testResponse',sendJson, function(resp, data) {
                    console.log('respuesta del servidor' + resp);
                    console.log(resp.code);
                });
            }
            break;
        default:
            console.log("Error");
            console.log(data);
            break;
    }


    //exec(`/home/debian/Sensor-IOT/SensorIoT/tests/testGps ${path_file}`,{maxBuffer: 1024 * 50000}, function (err, stdout, stderr) {

});

socket.on('requestRealTime', function (data) {

    console.log("EVENTO requestRealTime");
    console.log("data: " + data.axis);
    data = JSON.parse(data);
    config.realTime = true;
    if(data.axis === '0'){
        config.Axis = '0';
        console.log("Entro a all");
    }
    else if(data.axis === "BH1"){
        config.Axis = "BH1";
    }
    else if(data.axis === "BH2"){
        config.Axis = "BH2";
    }
    else if(data.axis === "BHZ"){
        config.Axis = "BHZ";
    }



});

socket.on('stopRealTime', function (data) {

    console.log("EVENTO stopRealTime");
    config.realTime = false;
    config.Axis = '';

});



function fileExecute(path) {

    return new Promise(function (fullfill) {
        exec(path,{maxBuffer: 1024 * 50000}, function (err, stdout, stderr) {
            console.log("dentro exec err: " + err);
            console.log("dentro stdout err: " + stdout);
            console.log("dentro stderr err: " + stderr);

            if(err) return fullfill({code:ERROR, msg: err});

        })
    });

}

function fileExecuteMain() {

    return new Promise(function (fullfill) {
        exec("/home/debian/Sensor-IOT/SensorIoT/sensor",{maxBuffer: 1024 * 50000}, function (err, stdout, stderr) {
            console.log("dentro exec err: " + err);
            console.log("dentro stdout err: " + stdout);
            console.log("dentro stderr err: " + stderr);

            if(err) return fullfill({code:ERROR, msg: err});

        })
    });

}

function closeProgram() {

    return new Promise(function (fullfill) {
        exec("ps -xa | grep ./sensor",{maxBuffer: 1024 * 50000}, function (err, stdout, stderr) {
            console.log("closeProgram exec err: " + err);
            console.log("closeProgram stdout : " + stdout);
            console.log("closeProgram stderr : " + stderr);

            if(err) return fullfill({code:ERROR, msg: err});

        })
    });
    //kill processNumber
}



module.exports = {
    socket: socket
};
//module.exports = socket;

//socket.emit('private message', { user: 'YOO', msg: 'MENSAJE 1' });