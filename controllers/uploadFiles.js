/**
 * Created by Frank on 20/04/2017.
 */

const fs = require('fs');
const request = require('request');
const auth = require("./auth");
const config = require('../config');

let socketClient = require('./socketIoManager');

exports.uploadFilesToServer = function uploadFilesToServer (token, dir_file) {

    return new Promise(
        function(fullfil) {

            console.log("uploadFiles");
            console.log(dir_file);


            let arrName = dir_file.split("/");
            let name = arrName[arrName.length - 1];

            let arrComp = name.split("_");
            let date = arrComp[0];
            let time = arrComp[1];

            let nameX = date + "_" + time + "_" + config.AXI_X + ".sac";
            let nameY = date + "_" + time + "_" + config.AXI_Y + ".sac";
            let nameZ = date + "_" + time + "_" + config.AXI_Z + ".sac";

            let dirX = config.PATH_FILES + date + "/" + nameX;
            let dirY = config.PATH_FILES + date + "/" + nameY;
            let dirZ = config.PATH_FILES + date + "/" + nameZ;

            console.log("direcciones : " + dirX );
            console.log("direcciones : " + dirY );
            console.log("direcciones : " + dirZ );

            let streamX = fs.createReadStream(dirX);
            let streamY = fs.createReadStream(dirY);
            let streamZ = fs.createReadStream(dirZ);

            let formData = {
                type: 'FILE',
                file_0: { value: streamX, options: {  filename: nameX, contentType: 'application/octet-stream' } },
                file_1: { value: streamY, options:  {  filename: nameY, contentType: 'application/octet-stream' } },
                file_2: { value: streamZ, options:  {  filename: nameZ, contentType: 'application/octet-stream' } }
            };


            upLoadFile(token, formData).then(function (data) {

                if(data.code === 401 || data.code === 403){

                    auth.doAuth().then(function (data) {

                        if(data.code === config.ERROR){
                            fullfil({code: config.ERROR});
                            checkForChangeSPSandEventParams();

                        }else{

                            let authToken = data.token;
                            console.log("PUT Re autenticacion con token: " + authToken);

                            let streamX2 = fs.createReadStream(dirX);
                            let streamY2 = fs.createReadStream(dirY);
                            let streamZ2 = fs.createReadStream(dirZ);

                            let formData2 = {
                                type: 'FILE',
                                file_0: { value: streamX2, options: {  filename: nameX, contentType: 'application/octet-stream' } },
                                file_1: { value: streamY2, options:  {  filename: nameY, contentType: 'application/octet-stream' } },
                                file_2: { value: streamZ2, options:  {  filename: nameZ, contentType: 'application/octet-stream' } }
                            };

                            console.log("El nombre del archivo es " + name2)  ;

                            upLoadFile(authToken, formData2).then(function (info) {
                                if(info.code === 401 || info.code === 403){
                                    fullfil({code: config.ERROR});
                                }
                                else{

                                    fullfil(info);
                                }
                                checkForChangeSPSandEventParams();
                            });

                        }
                    });
                }
                else{
                    checkForChangeSPSandEventParams();
                    fullfil(data);
                }
            });

        });
};

exports.uploadEventFiles = function uploadEventFiles(token,dir_file) {
    return new Promise(function (fullfil) {

        fs.readFile(config.DIR_EVENT_FILE, 'utf-8', (err, jevent) => {
            if (err) {
                console.log('uploadEventFiles error DIR_EVENT_FILE: ', err);
                fullfil({code: config.ERROR});
            }
            else {
                console.log("json " + jevent);
                let jEvents = JSON.parse(jevent);
                //{ "isActive": true, "sta": "1.0", "lta": "8.0", "thOn":"12.0" , "thOff": "10.0", "min_seconds":"3.0"} s:l:o:p:m:
                if(jEvents.isActive){

                    console.log("uploadEventFiles");
                    console.log(dir_file);

                    let stream = fs.createReadStream(dir_file);
                    let arrName = dir_file.split("/");
                    let name  = arrName[arrName.length - 1];
                    let formData = {
                        type: 'EVENT',
                        file_0: { value: stream, options: {  filename: name, contentType: 'application/octet-stream' } }
                    };

                    upLoadFile(token, formData).then(function (data) {
                        if(data.code === 401 || data.code === 403) {

                            auth.doAuth().then(function (result) {

                                if (result.code === config.ERROR) {
                                    fullfil({code: config.ERROR});

                                } else {
                                    let authToken = result.token;
                                    let stream2 = fs.createReadStream(dir_file);
                                    let formData2 = {
                                        type: 'EVENT',
                                        file_0: { value: stream2, options: {  filename: name, contentType: 'application/octet-stream' } }
                                    };

                                    upLoadFile(authToken, formData2).then(function (info) {
                                        if(info.code === 401 || info.code === 403){
                                            fullfil({code: config.ERROR});
                                        }
                                        else{
                                            fullfil(info);
                                        }
                                    });


                                }
                            });
                        }
                        else{
                            fullfil(data);
                        }
                    });

                }
                else{
                    console.log("El envio  de eventos esta desactivado");
                    fullfil({code: config.ERROR});
                }
            }
        });

    });
};

function upLoadFile(token, formData) {

    return new Promise(function (fullfil) {
        request.post({url:config.URL_UPLOAD, headers:{"Authorization": token}, formData: formData}, function(err, httpResponse, body) {

            console.log("upload error: " + err);
            if (err) return fullfil({code: config.ERROR});

            if(httpResponse.statusCode === 401 || httpResponse.statusCode === 403){

                return fullfil({code: httpResponse.statusCode});

            }else{
                if (err) {
                    console.error('Error: upload failed:', err);
                    return fullfil({code: config.ERROR});
                }
                else {
                    console.log('Upload OK', body);
                    return fullfil({code: config.SUCCESS});
                }
            }
        });
    });
}

function checkForChangeSPSandEventParams() {

    if(config.CHANGE_SPS_IN_MAIN || config.CHANGE_EVENT_PARAMS_IN_MAIN){

        socketClient.closeMainProgram().then(function (result) {
            if(result.code === config.ERROR){
                console.log("uploadFile: checkForChangeSPSandEventParams: error en closeMainProgram " +result);
            }
            else{
                socketClient.runMainProgram();
            }
        });
    }
}
