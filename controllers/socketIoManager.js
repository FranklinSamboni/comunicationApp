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
            //socket.emit('register', '{ "serial": "WDEFRGTTYJ" }', function (resp, data) {
            socket.emit('register', `{ "serial": "${serial}" }`, function (resp, data) {
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

    closeMainProgram().then(function (data) {
        switch (data.component){
            case config.GPS:
                if(data.type === config.GPS){
                    runProgram(config.DIR_TEST_GPS).then(function (data) {
                        console.log(data);
                    });
                }
                else if(data.type === config.PPS){
                    runProgram(config.DIR_TEST_PPS).then(function (data) {
                        console.log(data);
                    });
                }

                break;
            case config.RTC:
                if(data.type === config.RTC){
                    runProgram(config.DIR_TEST_RTC).then(function (data) {
                        console.log(data);
                    });
                }
                else if(data.type === config.SYNC){
                    runProgram(config.DIR_TEST_SYNC).then(function (data) {
                        console.log(data);
                    });
                }
                break;
            case config.ADC:
                runProgram(config.DIR_TEST_ADC).then(function (data) {
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
    });

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

function runMainProgram() {
    runProgram(config.PATH_MAIN_PROGRAM).then(function (data) {
       console.log(data);
    });
}

function runProgram(path) {

    return new Promise(function (fullfill) {
        exec(path,{maxBuffer: 1024 * 50000}, function (err, stdout, stderr) {
            console.log("runProgram err: " + err);
            console.log("runProgram stdout: " + stdout);
            console.log("runProgram stderr: " + stderr);

            if(err) return fullfill({code:config.ERROR, msg: err});

        });
    });
}

function closeMainProgram() {

    return new Promise(function (fulfill) {
        getNumberProcessMainProgram().then(function (data) {
            if(data.code === config.ERROR){
                console.log("Error obteniedo el numero del proceso del programa principal");
            }
            else{
                killProcess(data.process).then(function (data) {
                    if(data.code == config.ERROR){
                        console.log("Error cerrando el proceso");
                    }
                    else{
                        console.log("Se ha cesarro correctamente");
                    }
                });
            }
            fulfill(data);
        });
    });
    //kill processNumber
}

function getNumberProcessMainProgram() {
    return new Promise(function (fulfill) {
        exec("ps -xa | grep ./SensorIoT",{maxBuffer: 1024 * 50000}, function (err, stdout, stderr) {
            console.log("getNumberprocess exec err: " + err);
            console.log("getNumberprocess stdout : " + stdout);
            console.log("getNumberprocess stderr : " + stderr);

            if(err) return fulfill({code:config.ERROR, msg: err});

            let parameters = stdout.split("\n");
            let name = parameters[0].split("./");
            let process = parameters[0].split(" ");

            console.log("Nombre del archivo es : -" + name[1] + "-");
            console.log("El proceso es : -" + process[1]+ "-");

            fulfill({code:config.SUCCESS,process:process[1], name: name[1]});

        });
    });
}

function killProcess(process) {
    return new Promise(function (fulfill) {

        let command = "kill " + process;

        exec(command,{maxBuffer: 1024 * 50000}, function (err, stdout, stderr) {
            console.log("killProcess exec err: " + err);
            console.log("killProcess stdout : " + stdout);
            console.log("killProcess stderr : " + stderr);

            if(err) return fulfill({code:config.ERROR, msg: err});

            fulfill({code:config.SUCCESS});

        });

    });
}

module.exports = {
    socket: socket,
    runMainProgram: runMainProgram,
};