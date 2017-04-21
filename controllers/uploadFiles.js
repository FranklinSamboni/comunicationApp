/**
 * Created by Frank on 20/04/2017.
 */

const fs = require('fs');
const request = require('request');
const auth = require("./auth");
const config = require('../config');

exports.uploadFilesToServer = function uploadFilesToServer (token, dir_file) {

    return new Promise(
        function(fullfil) {

            console.log("uploadFiles");
            console.log(dir_file);

            //'/Users/farleyetc/Documents/FrankDocs/210417_01_BH1.sac'

            let readableStream = fs.createReadStream("C:/Users/Frank/Documents/MATLAB/PruebaArchivosSAC/130417_14_BH1.sac");

            let formData = {
                type: 'FILE',
                file_0: {
                    value: readableStream,
                    options: {
                        filename: '210417_01_BH1.sac', contentType: 'application/octet-stream'
                    }
                }
            };

            upLoadFile(token, formData).then(function (data) {

                if(data.code === 401 || data.code === 403){

                    auth.doAuth().then(function (data) {

                        if(data.code === config.ERROR){
                            fullfil({code: config.ERROR});

                        }else{

                            let authToken = data.token;
                            console.log("PUT Re autenticacion con token: " + authToken);

                            let read = fs.createReadStream("C:/Users/Frank/Documents/MATLAB/PruebaArchivosSAC/130417_14_BH1.sac");
                            let formData = {
                                type: 'FILE',
                                file_0: {
                                    value: read,
                                    options: {
                                        filename: '210417_01_BH1.sac', contentType: 'application/octet-stream'
                                    }
                                }
                            };

                            upLoadFile(authToken, formData).then(function (data) {
                                if(data.code === 401 || data.code === 403){
                                    fullfil({code: config.ERROR});
                                }
                                else{
                                    fullfil(data);
                                }

                            });

                        }
                    });
                }
                else{
                    fullfil(data);
                }
            });

        });
};

function upLoadFile(token, formData) {

    return new Promise(function (fullfil) {
        request.post({url:config.URL_UPLOAD, headers:{"Authorization": token}, formData: formData}, function(err, httpResponse, body) {

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