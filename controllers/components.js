/**
 * Created by Frank on 13/04/2017.
 */
let SUCCESS = 1;
let ERROR = -1;

//let CORRECT_STATUS_COMPONENT = "Correcto";
//let ERROR_STATUS_COMPONENT = "Error";

let URL_BASE = "https://api.plataformamec.com/api/";
let URL_ACCELEROMETER = URL_BASE + "accelerometer";
let URL_ADC = URL_BASE + "adc";
let URL_RTC = URL_BASE + "rtc";
let URL_WIFI = URL_BASE + "wifi";
let URL_CPU = URL_BASE + "cpu";
let URL_BATTERY = URL_BASE + "battery";
let URL_GPS = URL_BASE + "gps";
let URL_LOCATION = URL_BASE + "location";
let URL_UPLOAD = "/api/upload/file";


const DIR_COMPONENTS = "/home/debian/Sensor-IOT/SensorIoT/componentsFiles/";
const DIR_ACCELETOMETER = DIR_COMPONENTS + "accelerometer.json";
const DIR_ADC = DIR_COMPONENTS + "adc.json";
const DIR_RTC = DIR_COMPONENTS + "rtc.json"; 
const DIR_WIFI = DIR_COMPONENTS + "wifi.json";
const DIR_CPU = DIR_COMPONENTS  + "cpu.json";
const DIR_BATTERY = DIR_COMPONENTS  + "battery.json";
const DIR_GPS = DIR_COMPONENTS + "gps.json";
const DIR_LOCATION = DIR_COMPONENTS + "location.json";

const Client = require('node-rest-client').Client;
//const FormData = require('form-data');
const fs = require('fs');
const request = require('request');
const auth = require("./auth");
const client = new Client();
const config = require('../config');

//let auth = require('./auth.js');
//let exit = require('./exit.js');

//home/debian/Sensor-IOT/SensorIoT/muestras/200417/200417_00_BH1.sac

exports.acelerometerData = function acelerometerData (token) {

    return new Promise(
        function(fullfil) {

            console.log("acelerometerData");

            fs.readFile(DIR_ACCELETOMETER, 'utf-8', (err, json) => {
                if (err) {
                    console.log('error: ', err);
                    fullfil({code: ERROR});
                }
                else {

                    let jsonObj = JSON.parse(json);

                    let args = {
                        data: jsonObj,
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": token,
                        }
                    };

                    doPost(URL_ACCELEROMETER, args).then(function (data) {
                        if(data.code === ERROR){
                            fullfil({code: ERROR});
                        }else{
                            fullfil({code: SUCCESS});
                        }
                    });

                    /*client.post(URL_ACCELEROMETER, args, function (data, response) {
                        console.log("acelerometerData");
                        let jsonObj = data;
                        console.log(jsonObj);
                        if (jsonObj.code === "001" || jsonObj.code === "003") {
                            fullfil({code: SUCCESS});
                        }
                        else {
                            fullfil({code: ERROR});
                        }
                    });*/



                }
            });
        });
};

exports.adcData = function adcData (token) {

    return new Promise(
        function(fullfil) {

            console.log("adcData");

            fs.readFile(DIR_ADC, 'utf-8', (err, json) => {
                if (err) {
                    console.log('error: ', err);
                    fullfil({code: ERROR});
                }
                else {

                    let jsonObj = JSON.parse(json);
                    let args = {
                        data: jsonObj,
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": token,
                        }
                    };

                    //console.log(args);

                    client.post(URL_ADC, args, function (data, response) {
                        console.log("adcData");
                        let jsonObj = data;
                        console.log(jsonObj);
                        if (jsonObj.code === "001" || jsonObj.code === "003") {
                            fullfil({code: SUCCESS});
                        }
                        else {
                            fullfil({code: ERROR});
                        }
                    });
                }
            });
        });
};

exports.rtcData = function rtcData(token) {

    return new Promise(
        function(fullfil) {

            console.log("rtcData");

            fs.readFile(DIR_RTC, 'utf-8', (err, json) => {
                if(err) {
                    console.log('error: ', err);
                    fullfil({code: ERROR});
                }
                else {

                    let jsonObj = JSON.parse(json);

                    let args = {
                        data: jsonObj,
                        headers: {"Content-Type": "application/json",
                            "Authorization":token,}
                    };

                    //console.log(args);

                    client.post(URL_RTC, args, function (data, response) {
                        console.log("rtcData");
                        let jsonObj = data;
                        console.log(jsonObj);
                        if (jsonObj.code === "001" || jsonObj.code === "003") {
                            fullfil({code: SUCCESS});
                        }
                        else {
                            fullfil({code: ERROR});
                        }
                    });
                }
            });

        });
};

exports.cpuData = function cpuData (token) {

    return new Promise(
        function(fullfil) {
            console.log("cpuData");

            fs.readFile(DIR_CPU, 'utf-8', (err, json) => {
                if(err) {
                    console.log('error: ', err);
                    fullfil({code: ERROR});
                }
                else {

                    let jsonObj = JSON.parse(json);

                    let args = {
                        data: jsonObj,
                        headers: {"Content-Type": "application/json",
                            "Authorization":token,}
                    };

                    //console.log(args);

                    client.post(URL_CPU, args, function (data, response) {
                        console.log("cpuData");
                        let jsonObj = data;
                        console.log(jsonObj);
                        if (jsonObj.code === "001" || jsonObj.code === "003") {
                            fullfil({code: SUCCESS});
                            //callback(code,token);
                        }
                        else {
                            fullfil({code: ERROR});
                            //exit.preExitFunc();
                            //callback(code,token);
                        }
                    });
                }
            });
        });

};

exports.batteryData = function batteryData (token) {

    return new Promise(
        function(fullfil) {

            console.log("batteryData");

            fs.readFile(DIR_BATTERY, 'utf-8', (err, json) => {
                if(err) {
                    console.log('error: ', err);
                    fullfil({code: ERROR});
                }
                else {

                    let jsonObj = JSON.parse(json);

                    let args = {
                        data: jsonObj,
                        headers: {"Content-Type": "application/json",
                            "Authorization":token,}
                    };

                    //console.log(args);

                    client.post(URL_BATTERY, args, function (data, response) {
                        console.log("batteryData");
                        let jsonObj = data;
                        console.log(jsonObj);
                        if (jsonObj.code === "001" || jsonObj.code === "003") {
                            fullfil({code: SUCCESS});
                        }
                        else {
                            fullfil({code: ERROR});
                        }
                    });
                }
            });

        });
};

exports.gpsData = function gpsData (token) {

    return new Promise(
        function(fullfil) {

            console.log("gpsData");

            fs.readFile(DIR_GPS, 'utf-8', (err, json) => {
                if(err) {
                    fullfil({code: ERROR});
                }
                else {

                    let jsonObj = JSON.parse(json);

                    let args = {
                        data: jsonObj,
                        headers: {"Content-Type": "application/json",
                            "Authorization":token,}
                    };

                    //console.log(args);

                    client.post(URL_GPS, args, function (data, response) {
                        console.log("gpsData");
                        let jsonObj = data;
                        console.log(jsonObj);
                        if (jsonObj.code === "001" || jsonObj.code === "003") {
                            fullfil({code: SUCCESS});
                        }
                        else {
                            fullfil({code: ERROR});
                        }
                    });

                }
            });

        });
};

exports.wifiData = function (token) {

    return new Promise(
        function(fullfil) {

            console.log("wifiData");

            fs.readFile(DIR_WIFI, 'utf-8', (err, json) => {
                if(err) {
                    console.log('error: ', err);
                    fullfil({code: ERROR});
                }
                else {

                    let jsonObj = JSON.parse(json);

                    let args = {
                        data: jsonObj,
                        headers: {"Content-Type": "application/json",
                            "Authorization":token,}
                    };

                    //console.log(args);

                    client.post(URL_WIFI, args, function (data, response) {
                        console.log("wifiData");
                        let jsonObj = data;
                        console.log(jsonObj);
                        if (jsonObj.code === "001" || jsonObj.code === "003") {
                            fullfil({code: SUCCESS});
                        }
                        else {
                            fullfil({code: ERROR});
                        }
                    });

                }
            });

        });
};

exports.postLocation = function postLocation (token) {
    return new Promise(
        function(fullfil) {

            console.log("postLocation");

            fs.readFile(DIR_LOCATION, 'utf-8', (err, json) => {
                if(err) {
                    console.log('error: ', err);
                    fullfil({code: ERROR});
                }
                else {

                    let jsonObj = JSON.parse(json);
                    let args = {
                        data: jsonObj,
                        headers: {"Content-Type": "application/json",
                            "Authorization":token,}
                    };

                    //console.log(args)

                    client.post(URL_LOCATION, args, function (data, response) {
                        console.log("postLocation");
                        let jsonObj = data;
                        console.log(jsonObj);
                        if (jsonObj.code === "001" || jsonObj.code === "003") {
                            fullfil({code: SUCCESS});
                        }
                        else {
                            fullfil({code: ERROR});
                        }
                    });
                }
            });

        });
};


function doPost(url, args) {

    return new Promise(
        function(fullfil) {
            client.post(url,args, function (data, response) {
                let jsonObj = data;
                console.log(jsonObj);
                console.log("done Post");
                console.log("status code " + response.statusCode);

                if(response.statusCode === 401 || response.statusCode === 403){

                    auth.doAuth().then(function (data) {
                        if(data.code === ERROR){
                            fullfil({code: ERROR});
                        }else{
                            let authToken = data.token;
                            console.log("Re autenticacion con token: " + authToken);

                            let newArgs = {
                                data: args.data,
                                headers: {"Content-Type": "application/json",
                                    "Authorization":authToken,}
                            };

                            client.post(url,newArgs, function (data, response) {
                                let jobj = data;
                                console.log(jobj);
                                if (jobj.code === "001" || jobj.code === "003") {
                                    fullfil({code: SUCCESS});
                                }
                                else{
                                    fullfil({code: ERROR});
                                }
                            });
                        }
                    });
                }
                else{
                    if (jsonObj.code === "001" || jsonObj.code === "003") {
                        fullfil({code: SUCCESS});
                    }
                    else{
                        fullfil({code: ERROR});
                    }
                }

            });
        });
}

////// Actualizar Informacion ///////////

exports.putLocation = function putLocation (token) {
    return new Promise(
        function(fullfil) {

            console.log("putLocation");

            fs.readFile(DIR_LOCATION, 'utf-8', (err, json) => {
                if(err) {
                    console.log('error: ', err);
                    fullfil({code: ERROR});
                }
                else {

                    let jsonObj = JSON.parse(json);

                    let args = {
                        data: jsonObj,
                        headers: {"Content-Type": "application/json",
                            "Authorization":token,}
                    };

                    //console.log(args);

                    client.put(URL_LOCATION, args, function (data, response) {
                        console.log("putLocation");
                        let jsonObj = data;
                        console.log(jsonObj);
                        if (jsonObj.code === "001" || jsonObj.code === "003") {
                            fullfil({code: SUCCESS});
                        }
                        else {
                            fullfil({code: ERROR});
                        }
                    });

                }
            });

        });
};

exports.putRTC = function putRTC(token) {
    return new Promise(
        function(fullfil) {

            console.log("putRTC");

            fs.readFile(DIR_RTC, 'utf-8', (err, json) => {
                if(err) {
                    console.log('error: ', err);
                    fullfil({code: ERROR});
                }
                else {

                    let jsonObj = JSON.parse(json);

                    let args = {
                        data: jsonObj,
                        headers: {"Content-Type": "application/json",
                            "Authorization":token,}
                    };

                    //console.log(args);

                    client.put(URL_RTC, args, function (data, response) {
                        console.log("putRTC");
                        let jsonObj = data;
                        console.log(jsonObj);
                        if (jsonObj.code === "001" || jsonObj.code === "003") {
                            fullfil({code: SUCCESS});
                        }
                        else {
                            fullfil({code: ERROR});
                        }
                    });
                }
            });

        });
};

exports.putSPS = function putSPS(token) {
    return new Promise(
        function(fullfil) {

            console.log("putSPS");

            fs.readFile(DIR_ADC, 'utf-8', (err, json) => {
                if (err) {
                    console.log('error: ', err);
                    fullfil({code: ERROR});
                }
                else {

                    let jsonObj = JSON.parse(json);
                    let args = {
                        data: jsonObj,
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": token,
                        }
                    };

                    //console.log(args);

                    client.put(URL_ADC, args, function (data, response) {
                        console.log("putSPS");
                        let jsonObj = data;
                        console.log(jsonObj);
                        if (jsonObj.code === "001" || jsonObj.code === "003") {
                            fullfil({code: SUCCESS});
                        }
                        else {
                            fullfil({code: ERROR});
                        }
                    });
                }
            });
        });

};

exports.uploadFilesToServer = function uploadFilesToServer (token, dir_file) {

    return new Promise(
        function(fullfil) {

            console.log("uploadFiles");
            console.log(dir_file);
            //200417_00_BH1.sac
            //let path = '/Users/farleyetc/Documents/FrankDocs/200417_00_BH1.sac';

            /*let formData = {
                type: 'FILE',
                file_0: {
                    value:  fs.createReadStream('/Users/farleyetc/Documents/FrankDocs/200417_00_BH1.sac'),
                    options: {
                        filename: '200417_00_BH1.sac',

                    }
                }
            };*/

            //'/Users/farleyetc/Documents/FrankDocs/210417_01_BH1.sac'

            let readableStream = fs.createReadStream("C:/Users/Frank/Documents/MATLAB/PruebaArchivosSAC/130417_14_BH1.sac");
            let data = '';

            readableStream.on('data', function(chunk) {
                data+=chunk;
                //console.log("chunk: " + chunk);

            });

            readableStream.on('end', function() {
                //console.log("data: " );
                //console.log(data);

            });

            let r = request.post({url:'https://api.plataformamec.com/api/upload/file', headers:{"Authorization": token}}, function(err, httpResponse, body) {
                if (err) {
                    return console.error('upload failed:', err);
                }
                console.log('Upload successful!  Server responded with:', body);
            });
            let form = r.form();
            form.append('type', 'FILE');
            //form.append('my_buffer', new Buffer([1, 2, 3]));
            form.append('file', readableStream, {filename: '210417_01_BH1.sac', contentType: 'application/octet-stream'});


        });
};

//statusCode: 200,
//statusMessage: 'OK',