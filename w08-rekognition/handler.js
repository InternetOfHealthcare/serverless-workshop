'use strict';
var AWS         = require('aws-sdk');
var s3          = new AWS.S3(); 
var rekognition = new AWS.Rekognition({region: "us-east-1"});

exports.run = (event, context, callback) => {
    console.log(event);

    var bucket      = "healthcare-db";
    var key         = "foto.png";

    var paramsS3 = {
        Bucket: bucket,
        Key: key
    }            
    s3.getObject(paramsS3, function(err, json_data){
        if (err) {
            console.log(err);
            callback(err);
        }
        if (!err) {
            // Rekognition
            var paramsRek = {
              Image: {
                Bytes: json_data.Body
              },
              Attributes: [
                'ALL',
              ]
            };
            rekognition.detectFaces(paramsRek, function (err, data) {
                if (err) {
                    console.log(err);
                    callback(err);
                }
              
                if (!err) {
                    var counter=0;
                    data.FaceDetails.forEach(function(details){
                        //console.log(details);
                        counter++;
                    });
                }
                console.log("people:" + counter);
                callback(null, data);
            });
        }
    });
};
