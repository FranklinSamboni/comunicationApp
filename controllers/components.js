/**
 * Created by Frank on 13/04/2017.
 */

const Client = require('node-rest-client').Client;
const client = new Client();
const fs = require('fs');
const request = require('request');
const auth = require("./auth");

const config = require('../config');

//let auth = require('./auth.js');
//let exit = require('./exit.js');

//home/debian/Sensor-IOT/SensorIoT/muestras/200417/200417_00_BH1.sac

exports.acelerometerData = function acelerometerData (token) {

    return new Promise(
        function(fullfil) {

            console.log("acelerometerData");

            fs.readFile(config.DIR_ACCELETOMETER, 'utf-8', (err, json) => {
                if (err) {
                    console.log('error: ', err);
                    fullfil({code: config.ERROR});
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
                    doPost(config.URL_ACCELEROMETER, args).then(function (data) {
                        if(data.code === config.ERROR){
                            fullfil({code: config.ERROR});
                        }else{
                            fullfil({code: config.SUCCESS});
                        }
                    });
                }
            });
        });
};

exports.adcData = function adcData (token) {

    return new Promise(
        function(fullfil) {

            console.log("adcData");

            fs.readFile(config.DIR_ADC, 'utf-8', (err, json) => {
                if (err) {
                    console.log('error: ', err);
                    fullfil({code: config.ERROR});
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
                    doPost(config.URL_ADC, args).then(function (data) {
                        if(data.code === config.ERROR){
                            fullfil({code: config.ERROR});
                        }else{
                            fullfil({code: config.SUCCESS});
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

            fs.readFile(config.DIR_RTC, 'utf-8', (err, json) => {
                if(err) {
                    console.log('error: ', err);
                    fullfil({code: config.ERROR});
                }
                else {

                    let jsonObj = JSON.parse(json);

                    let args = {
                        data: jsonObj,
                        headers: {"Content-Type": "application/json",
                            "Authorization":token,}
                    };

                    //console.log(args);
                    doPost(config.URL_RTC, args).then(function (data) {
                        if(data.code === config.ERROR){
                            fullfil({code: config.ERROR});
                        }else{
                            fullfil({code: config.SUCCESS});
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

            fs.readFile(config.DIR_CPU, 'utf-8', (err, json) => {
                if(err) {
                    console.log('error: ', err);
                    fullfil({code: config.ERROR});
                }
                else {

                    let jsonObj = JSON.parse(json);

                    let args = {
                        data: jsonObj,
                        headers: {"Content-Type": "application/json",
                            "Authorization":token,}
                    };

                    //console.log(args);
                    doPost(config.URL_CPU, args).then(function (data) {
                        if(data.code === config.ERROR){
                            fullfil({code: config.ERROR});
                        }else{
                            fullfil({code: config.SUCCESS});
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

            fs.readFile(config.DIR_BATTERY, 'utf-8', (err, json) => {
                if(err) {
                    console.log('error: ', err);
                    fullfil({code: config.ERROR});
                }
                else {

                    let jsonObj = JSON.parse(json);

                    let args = {
                        data: jsonObj,
                        headers: {"Content-Type": "application/json",
                            "Authorization":token,}
                    };

                    //console.log(args);

                    doPost(config.URL_BATTERY, args).then(function (data) {
                        if(data.code === config.ERROR){
                            fullfil({code: config.ERROR});
                        }else{
                            fullfil({code: config.SUCCESS});
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

            fs.readFile(config.DIR_GPS, 'utf-8', (err, json) => {
                if(err) {
                    fullfil({code: config.ERROR});
                }
                else {

                    let jsonObj = JSON.parse(json);

                    let args = {
                        data: jsonObj,
                        headers: {"Content-Type": "application/json",
                            "Authorization":token,}
                    };

                    //console.log(args);
                    doPost(config.URL_GPS, args).then(function (data) {
                        if(data.code === config.ERROR){
                            fullfil({code: config.ERROR});
                        }else{
                            fullfil({code: config.SUCCESS});
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

            fs.readFile(config.DIR_WIFI, 'utf-8', (err, json) => {
                if(err) {
                    console.log('error: ', err);
                    fullfil({code: config.ERROR});
                }
                else {

                    let jsonObj = JSON.parse(json);

                    let args = {
                        data: jsonObj,
                        headers: {"Content-Type": "application/json",
                            "Authorization":token,}
                    };

                    //console.log(args);
                    doPost(config.URL_WIFI, args).then(function (data) {
                        if(data.code === config.ERROR){
                            fullfil({code: config.ERROR});
                        }else{
                            fullfil({code: config.SUCCESS});
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

            fs.readFile(config.DIR_LOCATION, 'utf-8', (err, json) => {
                if(err) {
                    console.log('error: ', err);
                    fullfil({code: config.ERROR});
                }
                else {

                    let jsonObj = JSON.parse(json);
                    let args = {
                        data: jsonObj,
                        headers: {"Content-Type": "application/json",
                            "Authorization":token,}
                    };

                    //console.log(args)
                    doPost(config.URL_LOCATION, args).then(function (data) {
                        if(data.code === config.ERROR){
                            fullfil({code: config.ERROR});
                        }else{
                            fullfil({code: config.SUCCESS});
                        }
                    });

                }
            });

        });
};

////// Actualizar Informacion ///////////

exports.putLocation = function putLocation (token) {
    return new Promise(
        function(fullfil) {

            console.log("putLocation");

            fs.readFile(config.DIR_LOCATION, 'utf-8', (err, json) => {
                if(err) {
                    console.log('error: ', err);
                    fullfil({code: config.ERROR});
                }
                else {

                    let jsonObj = JSON.parse(json);

                    let args = {
                        data: jsonObj,
                        headers: {"Content-Type": "application/json",
                            "Authorization":token,}
                    };

                    //console.log(args)
                    doPut(config.URL_LOCATION, args).then(function (data) {
                        if(data.code === config.ERROR){
                            fullfil({code: config.ERROR});
                        }else{
                            fullfil({code: config.SUCCESS});
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

            fs.readFile(config.DIR_RTC, 'utf-8', (err, json) => {
                if(err) {
                    console.log('error: ', err);
                    fullfil({code: config.ERROR});
                }
                else {

                    let jsonObj = JSON.parse(json);

                    let args = {
                        data: jsonObj,
                        headers: {"Content-Type": "application/json",
                            "Authorization":token,}
                    };

                    //console.log(args);

                    //console.log(args)
                    doPut(config.URL_RTC, args).then(function (data) {
                        if(data.code === config.ERROR){
                            fullfil({code: config.ERROR});
                        }else{
                            fullfil({code: config.SUCCESS});
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

            fs.readFile(config.DIR_ADC, 'utf-8', (err, json) => {
                if (err) {
                    console.log('error: ', err);
                    fullfil({code: config.ERROR});
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

                    doPut(config.URL_ADC, args).then(function (data) {
                        if(data.code === config.ERROR){
                            fullfil({code: config.ERROR});
                        }else{
                            fullfil({code: config.SUCCESS});
                        }
                    });
                }
            });
        });

};

/////// METODOS BASICOS ////////////////

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
                        if(data.code === config.ERROR){
                            fullfil({code: config.ERROR});
                        }else{
                            let authToken = data.token;
                            console.log("Post Re autenticacion con token: " + authToken);

                            let newArgs = {
                                data: args.data,
                                headers: {"Content-Type": "application/json",
                                    "Authorization":authToken,}
                            };

                            client.post(url,newArgs, function (data, response) {
                                let jobj = data;
                                console.log(jobj);
                                if (jobj.code === "001" || jobj.code === "003") {
                                    fullfil({code: config.SUCCESS});
                                }
                                else{
                                    fullfil({code: config.ERROR});
                                }
                            });
                        }
                    });
                }
                else{
                    if (jsonObj.code === "001" || jsonObj.code === "003") {
                        fullfil({code: config.SUCCESS});
                    }
                    else{
                        fullfil({code: config.ERROR});
                    }
                }

            });
        });
}


function doPut(url, args) {

    return new Promise(
        function(fullfil) {
            client.put(url,args, function (data, response) {
                let jsonObj = data;
                console.log(jsonObj);
                console.log("done PUT");
                console.log("status code " + response.statusCode);

                if(response.statusCode === 401 || response.statusCode === 403){

                    auth.doAuth().then(function (data) {
                        if(data.code === config.ERROR){
                            fullfil({code: config.ERROR});
                        }else{
                            let authToken = data.token;
                            console.log("PUT Re autenticacion con token: " + authToken);

                            console.log("put lo que sea" + args.data);
                            console.log("put lo que sea longitude" + args.data.longitude);
                            console.log("put lo que sea latitude" + args.data.latitude);

                            let newArgs = {
                                data: args.data,
                                headers: {"Content-Type": "application/json",
                                    "Authorization":authToken,}
                            };

                            client.put(url,newArgs, function (data, response) {
                                let jobj = data;
                                console.log(jobj);
                                if (jobj.code === "001" || jobj.code === "003") {
                                    fullfil({code: config.SUCCESS});
                                }
                                else{
                                    fullfil({code: config.ERROR});
                                }
                            });
                        }
                    });
                }
                else{
                    if (jsonObj.code === "001" || jsonObj.code === "003") {
                        fullfil({code: config.SUCCESS});
                    }
                    else{
                        fullfil({code: config.ERROR});
                    }
                }

            });
        });
}
