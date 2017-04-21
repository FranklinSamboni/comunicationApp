/**
 * Created by Frank on 13/04/2017.
 */


const express = require('express');
const components = require('../controllers/components');
const auth = require('../controllers/auth');
const  socket = require('../controllers/socketIoManager');
const router = express.Router();
const socketServer = require('../controllers/socketServer');
const config = require('../config');
const uploadFile = require('../controllers/uploadFiles');
/* GET home page. */

/*
router.get('/', function(req, res, next) {

    auth.doAuth().then(function (data) {

        if(data.code === config.ERROR){
            res.status(201).send({code:"002"});
        }else{
            let authToken = data.token;
            console.log(authToken);

            components.acelerometerData(authToken).then(function (data) {
                if(data.code === config.ERROR){
                    res.status(201).send({code:"002"});
                }else{
                    components.adcData(authToken).then(function (data) {
                        if(data.code === config.ERROR){
                            res.status(201).send({code:"002"});
                        }else{
                            components.rtcData(authToken).then(function (data) {
                                if(data.code === config.ERROR){
                                    res.status(201).send({code:"002"});
                                }else{
                                    components.cpuData(authToken).then(function (data) {
                                        if(data.code === config.ERROR){
                                            res.status(201).send({code:"002"});
                                        }else {
                                            components.batteryData(authToken).then(function (data) {
                                                if(data.code === config.ERROR){
                                                    res.status(201).send({code:"002"});
                                                }else{
                                                    components.gpsData(authToken).then(function (data) {
                                                        if(data.code === config.ERROR){
                                                            res.status(201).send({code:"002"});
                                                        } else{
                                                            components.wifiData(authToken).then(function (data) {
                                                                if(data.code === config.ERROR){
                                                                    res.status(201).send({code:"002"});
                                                                }else{
                                                                    components.postLocation(authToken).then(function (data) {
                                                                        if(data.code === config.ERROR){
                                                                            res.status(201).send({code:"002"});
                                                                        }else{
                                                                            res.status(200).send({code:"001"});
                                                                        }
                                                                    });
                                                                }
                                                            })
                                                        }
                                                    })
                                                }
                                            });
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            });
        }
    })
});

*/

/*
router.get('/', function(req, res, next) {
    auth.doAuth().then(function (data) {

        if (data.code === config.ERROR) {
            res.status(201).send({code: "002"});
        } else {
            let authToken = data.token;
            console.log(authToken);
            components.uploadFilesToServer(authToken, "").then(function (data) {
                if (data.code === config.ERROR) {
                    res.status(201).send({code: "002"});
                } else {
                    res.status(200).send({code: "001"});
                }
            });
        }
    });
});*/

/*
router.get('/', function(req, res, next) {
    auth.doAuth().then(function (data) {

        if (data.code === config.ERROR) {
            res.status(201).send({code: "002"});
        } else {
            let authToken = data.token;
            console.log(authToken);
            uploadFile.uploadFilesToServer(authToken,"").then(function (data) {
                if (data.code === config.ERROR) {
                    res.status(201).send({code: "002"});
                } else {
                    res.status(200).send({code: "001"});
                }
            });
        }
    });
});*/

module.exports = router;
