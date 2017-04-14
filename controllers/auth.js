/**
 * Created by Frank on 13/04/2017.
 */

const URL_AUTH = "https://plataformamec.com/api/auth";
const SUCCESS = 1;
const ERROR = -1;

const Client = require('node-rest-client').Client;
const client = new Client();

let fs = require('fs');

//console.log("Inicio");

exports.doAuth = new Promise(
    function(fullfil) {
        let code = ERROR;
        let token = "";

        fs.readFile('/home/debian/Sensor-IOT/SensorIoT/componentsFiles/serial.txt', 'utf-8', (err, serial) => {
            if (err) {

                console.log('error: ', err);
                code = ERROR;
                fullfil({code: code, token: token});

            } else {

                //console.log(serial);

                var args = {
                    data: {"serial": serial},
                    headers: {"Content-Type": "application/json"}
                };

                //console.log("Post");

                client.post(URL_AUTH, args, function (data, response) {
                    //console.log("client.post");

                    var jsonObj = data;

                    if (jsonObj.code == "001") {

                        token = jsonObj.data.token;
                        //console.log("El token es :" + token);

                        fullfil({code: SUCCESS, token: token});

                    }
                    else {

                        console.log(data);
                        fullfil({code: ERROR, token: token});
                        //console.log("El codigo es: " + jsonObj.code);
                    }
                });
            }
        });
    });

// registering remote methods
/*    client.registerMethod("postMethod", "https://plataformamec.com/api/auth", "POST");

 console.log("postMethod");

 client.methods.postMethod(args, function (data, response) {
 // parsed response body as js object
 console.log("client.methods.postMethod");
 console.log(data);
 // raw response
 //console.log(response);
 });
 */