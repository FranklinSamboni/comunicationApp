/**
 * Created by Frank on 13/04/2017.
 */
let SUCCESS = 1;
let ERROR = -1;

const express = require('express');
const components = require('../controllers/components');
const auth = require('../controllers/auth');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {

    auth.doAuth.then(function (data) {

        if(data.code === ERROR){
            res.status(201).send({code:"002"});
        }else{
            let authToken = data.token;
            console.log(authToken);

            components.acelerometerData(authToken).then(function (data) {
                if(data.code === ERROR){
                    res.status(201).send({code:"002"});
                }else{
                    components.adcData(authToken).then(function (data) {
                        if(data.code === ERROR){
                            res.status(201).send({code:"002"});
                        }else{
                            components.rtcData(authToken).then(function (data) {
                                if(data.code === ERROR){
                                    res.status(201).send({code:"002"});
                                }else{
                                    components.cpuData(authToken).then(function (data) {
                                        if(data.code === ERROR){
                                            res.status(201).send({code:"002"});
                                        }else {
                                            components.batteryData(authToken).then(function (data) {
                                                if(data.code === ERROR){
                                                    res.status(201).send({code:"002"});
                                                }else{
                                                    components.gpsData(authToken).then(function (data) {
                                                        if(data.code === ERROR){
                                                            res.status(201).send({code:"002"});
                                                        } else{
                                                            components.wifiData(authToken).then(function (data) {
                                                                if(data.code === ERROR){
                                                                    res.status(201).send({code:"002"});
                                                                }else{
                                                                    res.status(200).send({code:"001"});
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

module.exports = router;
