/**
 * Created by Frank on 13/04/2017.
 */

const express = require('express');
const components = require('../controllers/components');
const auth = require('../controllers/auth');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {

    auth.doAuth.then(function (data) {
        if(data.code == -1){
            //exit.preExitFunc();
        }else{
            let authToken = data.token;
            console.log(authToken);

            //var config = require('./componentsFiles/accelerometer.json');
            //console.log(config);
            /*acelerometerData(token);
             adcData(token);
             rtcData(token);
             cpuData(token);
             batteryData(token);
             gpsData(token);*/
            //this.acelerometerData(token);
        }
    })
});

module.exports = router;
