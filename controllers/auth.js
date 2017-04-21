/**
 * Created by Frank on 13/04/2017.
 */

const Client = require('node-rest-client').Client;
const client = new Client();
const config = require('../config');
let fs = require('fs');

exports.doAuth = function doAuth () {
    return new Promise(function(fullfil) {
        let code = config.ERROR;

        fs.readFile(config.PATH_SERIAL, 'utf-8', (err, serial) => {
            if (err) {

                console.log('error: ', err);
                code = config.ERROR;
                fullfil({code: code, token: null});

            } else {

                //console.log(serial);

                let args = {
                    //data: {"serial": serial},
                    data: {"serial": "WDEFRGTTYJ"},
                    headers: {"Content-Type": "application/json"}
                };


                client.post(config.URL_AUTH, args, function (data, response) {
                    //console.log("client.post");

                    let jsonObj = data;
                    console.log(data);
                    if (jsonObj.code === "001") {

                        let token = jsonObj.data.token;
                        config.REST_TOKEN = token;
                        fullfil({code: config.SUCCESS, token: token});

                    }
                    else {
                        console.log(data);
                        fullfil({code: config.ERROR, token: null});
                        //console.log("El codigo es: " + jsonObj.code);
                    }
                });
            }
        });
    });
};
