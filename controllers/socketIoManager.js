/**
 * Created by Frank on 14/04/2017.
 */

const io = require('socket.io-client');
const config = require('../config');
const exec = require('child_process').exec;
const fs = require('fs');

let socket = io.connect(config.URL_SOCKET);

socket.on('connect', function () {
    console.log("socket connected");

    fs.readFile(config.PATH_SERIAL, 'utf-8', (err, serial) => {
        if (err) {
            console.log('SocketIO: error haciendo autenticacion en el socket', err);
        } else {
            socket.emit('register', '{ "serial": "WDEFRGTTYJ" }', function (resp, data) {
                resp = JSON.parse(resp);
                console.log(resp.code);
                config.SOCKET_TOKEN = resp.data.token;
            });
        }
    });
});

socket.on('disconnect', function () {
    console.log("socket io disconnect");
});

socket.on('requestTest', function (data) {
    data = JSON.parse(data);
    console.log("requestTest data" + data);
    //console.log("requestTest fn" + fn);
    switch (data.component){
        case config.GPS:
            if(data.type === config.GPS){
                fileExecute(config.DIR_TEST_GPS).then(function (data) {
                    console.log(data);
                });
            }
            else if(data.type === config.PPS){
                fileExecute(config.DIR_TEST_PPS).then(function (data) {
                    console.log(data);
                });
            }

            break;
        case config.RTC:
            if(data.type === config.RTC){
                fileExecute(config.DIR_TEST_RTC).then(function (data) {
                    console.log(data);
                });
            }
            else if(data.type === config.SYNC){
                fileExecute(config.DIR_TEST_SYNC).then(function (data) {
                    console.log(data);
                });
            }
            break;
        case config.ADC:
            fileExecute(config.DIR_TEST_ADC).then(function (data) {
                console.log(data);
            });
            break;
        case config.ACC:
            break;
        case config.BAT:
            break;
        case config.WIFI:
            if (config.SOCKET_TOKEN !== ""){
                let last = true;
                let sendJson = `{"token": "${config.SOCKET_TOKEN}", "msg": "Wifi funciona conrrectamente", "last" : ${last} }`;
                socket.emit('testResponse',sendJson, function(resp, data) {
                    console.log('respuesta del servidor' + resp);
                    console.log(resp.code);
                });
            }
            break;
        default:
            console.log("Error en requestTest SocketIoManager");
            console.log(data);
            break;
    }


    //exec(`/home/debian/Sensor-IOT/SensorIoT/tests/testGps ${path_file}`,{maxBuffer: 1024 * 50000}, function (err, stdout, stderr) {

});

socket.on('requestRealTime', function (data) {

    console.log("EVENTO requestRealTime");
    console.log("data: " + data.axis);
    data = JSON.parse(data);
    config.ENABLE_REAL_TIME = true;
    if(data.axis === '0'){
        config.AXIS = config.ALL_AXIS;
        console.log("Todos los ejes");
    }
    else if(data.axis === "BH1"){
        config.AXIS = config.AXI_X;
    }
    else if(data.AXIS === "BH2"){
        config.AXIS = config.AXI_Y;
    }
    else if(data.axis === "BHZ"){
        config.AXIS = config.AXI_Z;
    }
});

socket.on('stopRealTime', function (data) {

    console.log("EVENTO stopRealTime");
    config.ENABLE_REAL_TIME = false;
    config.AXIS = '';

});

function fileExecute(path) {

    return new Promise(function (fullfill) {
        exec(path,{maxBuffer: 1024 * 50000}, function (err, stdout, stderr) {
            console.log("dentro exec err: " + err);
            console.log("dentro stdout err: " + stdout);
            console.log("dentro stderr err: " + stderr);

            if(err) return fullfill({code:config.ERROR, msg: err});

        })
    });

}

module.exports = {
    socket: socket
};


/*
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
}*/