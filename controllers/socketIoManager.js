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
                emitResponseStatus(true,"");
                runMainProgram();
                console.log("despues del run");
            });

        }
        else if(json.status === "Inactive"){
            closeMainProgram().then(function (data) {
                if(data.code === config.ERROR){
                    emitResponseStatus(false,"Ya esta cerrando el programa");
                }
                else{
                    emitResponseStatus(true,"");
                }
            });
        }
    }

    else if(json.option === "EVENT"){
        fs.readFile(config.DIR_EVENT_FILE, 'utf-8', (err, jeventos) => {
            if (err) {
                console.log('error DIR_EVENT_FILE: ', err);
                emitResponseStatus(false,err);
            }
            else{

                console.log("json " + jeventos);
                let jEvents = JSON.parse(jeventos);
                //{ "isActive": true, "sta": "1.0", "lta": "8.0", "thOn":"12.0" , "thOff": "10.0", "min_seconds":"3.0"} s:l:o:p:m:
                let newjson = "";

                if(json.status === "Active"){
                    newjson = `\{"isActive": ${true},"sta": "${jEvents.sta}", "lta": "${jEvents.lta}", "thOn": "${jEvents.thOn}" , "thOff": "${jEvents.thOff}" , "min_seconds": "${jEvents.min_seconds}",  "pre_event": "${jEvents.pre_event}" ,"post_event": "${jEvents.post_event}"  } `;
                }
                else if(json.status === "Inactive"){
                    newjson = `\{"isActive": ${false},"sta": "${jEvents.sta}", "lta": "${jEvents.lta}", "thOn": "${jEvents.thOn}" , "thOff": "${jEvents.thOff}" , "min_seconds": "${jEvents.min_seconds}", "pre_event": "${jEvents.pre_event}" ,"post_event": "${jEvents.post_event}"  } `;
                }

                if(newjson !== ""){
                    fs.writeFile(config.DIR_EVENT_FILE, newjson, 'utf8', function (err) {
                        if (err){
                            emitResponseStatus(false,err);
                            console.log(err);
                        }
                        else {
                            emitResponseStatus(true,"");
                        }
                    });
                }
                else{
                    emitResponseStatus(false,"Error actualizando el archivo de configuración, parametros incorrectos");
                }

            }
        });
    }
    else{
        console.log("Parametro incorrecto en requestStatus");
    }

});

function emitResponseStatus(confirm,msg) {
    let sendJson = `{"token": "${config.SOCKET_TOKEN}", "confirm": ${confirm} , "msg": "${msg}"}`;
    socket.emit('responseStatus',sendJson );
}

socket.on('requestEvents', function (data) {

    console.log(data);
    let json = JSON.parse(data);

    fs.readFile(config.DIR_EVENT_FILE, 'utf-8', (err, jevent) => {
        if (err) {
            console.log('error DIR_EVENT_FILE: ', err);
            emitResponseEvents(false,json.data,json.socketWeb);
        }
        else {

            console.log("json " + jevent);
            let jEvents = JSON.parse(jevent);
            //{ "isActive": true, "sta": "1.0", "lta": "8.0", "thOn":"12.0" , "thOff": "10.0", "min_seconds":"3.0"} s:l:o:p:m:
            let newjson = `\{"isActive": ${jEvents.isActive},"sta": "${json.data.d_w_sta}", "lta": "${json.data.d_w_lta}", "thOn": "${json.data.t_on}" , "thOff": "${json.data.t_off}" , "min_seconds": "${json.data.d_min}", "pre_event": "${json.data.d_pre}" ,"post_event": "${json.data.d_pos}" } `;

            fs.writeFile(config.DIR_EVENT_FILE, newjson, 'utf8', function (err) {
                if (err) {
                    emitResponseEvents(false, json.data, json.socketWeb);
                    console.log(err);
                }
                else {
                    emitResponseEvents(true,json.data,json.socketWeb);
                }
            });

        }
    });

});

function emitResponseEvents(confirm,data, socketWeb) {
    let sendJson = `{"token": "${config.SOCKET_TOKEN}","confirm": ${confirm}, "data": ${data} , "socketWeb": "${socketWeb}"}`;
    socket.emit('responseEvents',sendJson );
}

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

                        fs.readFile(config.DIR_EVENT_FILE, 'utf-8', (err, events) => {
                            if (err) {
                                console.log('error: ', err);
                                fullfil({code: config.ERROR});
                            }
                            else {
                                console.log(events);
                                jEvents = JSON.parse(events);
                                //{ "isActive": true, "sta": "1.0", "lta": "8.0", "thOn":"12.0" , "thOff": "10.0", "min_seconds":"3.0"} s:l:o:p:m:

                                let add = " -v " + "-s " + jEvents.sta + " -l " + jEvents.lta + " -o " + jEvents.thOn + " -p " + jEvents.thOff + " -m " + jEvents.min_seconds + " -b " + jEvents.pre_event + " -a " + jEvents.post_event;
                                let command = config.PATH_MAIN_PROGRAM + " -f " + samples + add;
                                config.CHANGE_SPS_IN_MAIN = false;
                                runProgram(command).then(function (data) {
                                    console.log("data en run main " + data.msg);
                                    fullfil(data);
                                });

                            }
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
            console.log("runProgram err: " + err);
            console.log("runProgram stdout: " + stdout);
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