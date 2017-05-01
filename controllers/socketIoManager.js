/**
 * Created by Frank on 14/04/2017.
 */

const io = require('socket.io-client');
const config = require('../config');
const exec = require('child_process').exec;
const fs = require('fs');

//const Array = require('node-array');

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
    config.ENABLE_REAL_TIME = false;
    console.log("socket io disconnect");
});

socket.on('requestTest', function (data) {
    let json = JSON.parse(data);
    console.log("requestTest data" + data);

    if (json.component === config.WIFI){
        if (config.SOCKET_TOKEN !== ""){
            let last = true;
            let sendJson = `{"token": "${config.SOCKET_TOKEN}", "data": "Wifi funciona conrrectamente", "last" : ${last} }`;
            socket.emit('testResponse',sendJson, function(resp, data) {
                console.log('respuesta del servidor' + resp);
                console.log(resp.code);
            });
        }
    }
    else if (json.component === config.GPS  || json.component === config.RTC  || json.component === config.ADC ){
        closeMainProgram().then(function (close) {
            switch (json.component){
                case config.GPS:
                    if(json.type === config.GPS){
                        runProgram(config.DIR_TEST_GPS).then(function (data) {
                            console.log(data);
                        });
                    }
                    else if(json.type === config.PPS){
                        runProgram(config.DIR_TEST_PPS).then(function (data) {
                            console.log(data);
                        });
                    }

                    break;
                case config.RTC:
                    if(json.type === config.RTC){
                        runProgram(config.DIR_TEST_RTC).then(function (data) {
                            console.log(data);
                        });
                    }
                    else if(json.type === config.SYNC){
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
                /*case config.ACC:
                 break;
                 case config.BAT:
                 break;*/
                default:
                    console.log("Error en requestTest SocketIoManager");
                    console.log(json);
                    break;
            }
        });
    }
    else{
        console.log("opcion incorrecta en requestTest " + data);
    }

});

socket.on('requestRealTime', function (data) {

    if(config.AVALIBLE_FOR_REAL_TIME){
        console.log("EVENTO requestRealTime");
        data = JSON.parse(data);
        console.log("data: -" + data.axis + "-");
        config.ENABLE_REAL_TIME = true;
        if(data.axis === '0'){
            config.AXIS = config.ALL_AXIS;
            console.log("Todos los ejes");
        }
        else if(data.axis === config.AXI_X){
            config.AXIS = config.AXI_X;
        }
        else if(data.axis === config.AXI_Y){
            config.AXIS = config.AXI_Y;
        }
        else if(data.axis === config.AXI_Z){
            config.AXIS = config.AXI_Z;
        }
    }
    else{
        let sendJson = `{"token": "${config.SOCKET_TOKEN}", "available": ${false} , "data": { }}`;
        socket.emit('responseRealTime',sendJson);
    }


});

socket.on('stopRealTime', function (data) {

    console.log("EVENTO stopRealTime");
    config.ENABLE_REAL_TIME = false;
    config.AXIS = '';

});

socket.on('setSPS', function (data) {

    console.log("EVENTO setSPS");
    console.log("sps : " + data);
    data = JSON.parse(data);
    if(data.sps === "40" || data.sps === "50" || data.sps === "100" || data.sps === "200"){

        fs.readFile(config.DIR_ADC, 'utf-8', (err, json) => {
            if (err) {
                console.log('error: ', err);
                emitSaveSPS(false);
            }
            else{

                console.log("json " + json);
                json = JSON.parse(json);
                let newjson = `\{"status": "${json.status}","descript": "${json.descript}", "samples": "${data.sps}", "error": "${json.error}" } `;
                fs.writeFile(config.DIR_ADC, newjson, 'utf8', function (err) {
                    if (err){
                        emitSaveSPS(false);
                        return console.log(err);
                    }
                    else {
                        emitSaveSPS(true);
                        config.CHANGE_SPS_IN_MAIN = true;
                    }
                });
            }
        });
    }
    else{
        emitSaveSPS(false);
    }

});

function emitSaveSPS(success) {
    let sendJson = `{"token": "${config.SOCKET_TOKEN}", "data": ${success} }`;
    socket.emit("saveSPS",sendJson);
}

socket.on('requestStatus', function (data) {

    console.log(data);
    let json = JSON.parse(data);

    if(json.option === "READ"){
        if(json.status === "Active"){

            closeMainProgram().then(function (close) {
                runMainProgram();

                let sendJson = `{"token": "${config.SOCKET_TOKEN}", "confirm": ${true} , "msg": ""}`;
                socket.emit('statusResponse', );

            });

        }
        else if(json.status === "Inactive"){
            closeMainProgram().then(function (data) {
                if(data.code === config.ERROR){
                    let sendJson = `{"token": "${config.SOCKET_TOKEN}", "confirm": ${false} , "msg": "Error cerrando el programa"}`;
                    socket.emit('statusResponse', );
                }
                else{
                    let sendJson = `{"token": "${config.SOCKET_TOKEN}", "confirm": ${true} , "msg": ""}`;
                    socket.emit('statusResponse', );
                }
            });
        }
    }

    /*
    else if(json.option === "EVENT"){

    }
    else{

    }*/

});

//statusResponse

function runMainProgram() {

    return new Promise(function (fullfil) {

        fs.readFile(config.DIR_ADC, 'utf-8', (err, json) => {
            if (err) {
                console.log('error: ', err);
                fullfil({code: config.ERROR});
            }
            else {
                try {

                    json = JSON.parse(json);
                    let samples = json.samples;
                    console.log("adc file a " + json.samples );
                    if (samples === "40" || samples === "50" || samples === "100" || samples === "200") {
                        let command = config.PATH_MAIN_PROGRAM + " " +  samples;
                        config.CHANGE_SPS_IN_MAIN = false;
                        runProgram(command).then(function (data) {
                            console.log("data en run main " + data);
                            fullfil(data);
                        });
                    }
                    else {
                        console.log("El archivo de muestras del ADC esta mal configurado, revisa el parametro -samples-.");
                        fullfil({code: config.ERROR});
                    }

                }
                catch (err) {
                    console.log(err);
                    fullfil({code: config.ERROR});
                }

            }
        });

    });

}

function runProgram(path) {

    return new Promise(function (fullfill) {
        exec(path,{maxBuffer: 1024 * 50000}, function (err, stdout, stderr) {
            //console.log("runProgram err: " + err);
            //console.log("runProgram stdout: " + stdout);
            //console.log("runProgram stderr: " + stderr);

            if(err) return fullfill({code:config.ERROR, msg: err});

        });
    });
}

function closeMainProgram() {

    return new Promise(function (fulfill) {
        /*getNumberProcessMainProgram().then(function (data) {
            if(data.code === config.ERROR){
                console.log("Error obteniedo el numero del proceso del programa principal");
            }
            else{
                */
                killProcess("SensorIoT").then(function (data) {
                    config.AVALIBLE_FOR_REAL_TIME = false;
                    if(data.code === config.ERROR){
                        console.log("Error cerrando el proceso");
                    }
                    else{
                        console.log("Se ha cerrado correctamente");
                    }
                    fulfill(data);
                });
           /* }
            fulfill(data);
        });*/
    });
    //kill processNumber
}

function killProcess(process) {
    return new Promise(function (fulfill) {

        let command = "pkill " + process;

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
    closeMainProgram: closeMainProgram
};

/*
function getNumberProcessMainProgram() {
    return new Promise(function (fulfill) {
        exec("pgrep SensorIoT",{maxBuffer: 1024 * 50000}, function (err, stdout, stderr) {
            console.log("getNumberprocess exec err: " + err);
            console.log("getNumberprocess stdout : " + stdout);
            console.log("getNumberprocess stderr : " + stderr);

            if(err) return fulfill({code:config.ERROR, msg: err});

            let parameters = stdout.split("\n");

            let process = "";

            for(let i = 0; i < parameters.length ;i++){
                let index = parameters[i].indexOf(config.PATH_MAIN_PROGRAM);
                if(index !== -1){
                    process = parameters[i].split(" ");
                }
            }

            //let name = parameters[0].split("./");
             ///let process = parameters[0].split(" ");

             //console.log("Nombre del archivo es : -" + name[1] + "-");
            // console.log("El proceso es : -" + process[1]+ "-");

            //fulfill({code:config.SUCCESS,process:process[1]});

        });
    });
}*/