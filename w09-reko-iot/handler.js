'use strict';
var AWS         = require('aws-sdk');
var s3          = new AWS.S3(); 
var rekognition = new AWS.Rekognition({region: "us-east-1"});
const iotData = 
  new AWS.IotData({ endpoint: "a2p4fyajwx9lux.iot.us-east-1.amazonaws.com" });

exports.run = (event, context, callback) => {
    console.log(event);

    var record      = event.Records[0];
    var bucket      = record.s3.bucket.name;
    var key         = record.s3.object.key;
   
    //key = key.replaceAll("+", " ");
    console.log(bucket);
    console.log(key);

    var paramsS3 = {
        Bucket: bucket,
        Key: key
    }            
    s3.getObject(paramsS3, function(err, json_data){
        if (err) {
            console.log("some error opening S3 file...");
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
                        console.log(details);
                        counter++;
                    });
                }
                sendMQTTMessage(res=> {
                    if(res=="ok") {
                    }
                },"countPeople", '{"counter" : '  + counter + '}')
    
                callback(null, data);
            });
        }
    });
};

function sendMQTTMessage(callback, topic, txt) {
    var params = {
        topic: topic,
        payload: txt
    }
    iotData.publish(params, (err, res) => {
      if (err) { 
          console.log(err);
          callback("error");
      }
      else {
          console.log("message IoT sent!")
          callback("ok");
      }
    });
}
