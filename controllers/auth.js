/**
 * Created by Frank on 13/04/2017.
 */

const URL_AUTH = "https://api.plataformamec.com/api/auth";
const PATH_SERIAL = "/home/debian/Sensor-IOT/SensorIoT/componentsFiles/serial.txt";
//const PATH_SERIAL = "/home/pru.c";
///const PATH_SERIAL ="C://Users//Frank//Documents//sss.txt";
const SUCCESS = 1;
const ERROR = -1;

const Client = require('node-rest-client').Client;
const client = new Client();

let fs = require('fs');

exports.doAuth = function doAuth () {
    return new Promise(function(fullfil) {
        let code = ERROR;

        fs.readFile(PATH_SERIAL, 'utf-8', (err, serial) => {
            if (err) {

                console.log('error: ', err);
                code = ERROR;
                fullfil({code: code, token: null});

            } else {

                //console.log(serial);

                let args = {
                    //data: {"serial": serial},
                    data: {"serial": "Q2SW4ER5T6"},
                    headers: {"Content-Type": "application/json"}
                };

                //console.log("Post");

                client.post(URL_AUTH, args, function (data, response) {
                    //console.log("client.post");

                    let jsonObj = data;
                    console.log(data);
                    if (jsonObj.code === "001") {

                        let token = jsonObj.data.token;
                        //console.log("El token es :" + token);

                        fullfil({code: SUCCESS, token: token});

                    }
                    else {

                        console.log(data);
                        fullfil({code: ERROR, token: null});
                        //console.log("El codigo es: " + jsonObj.code);
                    }
                });
            }
        });
    });
};



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