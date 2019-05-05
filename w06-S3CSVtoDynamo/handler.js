'use strict';

var AWS = require('aws-sdk');
var s3 = new AWS.S3();
const dynamoDB = new AWS.DynamoDB.DocumentClient();
const uuid = require('uuid');
const AVG = 1;
const AVG_MORNING = 2;


exports.hello = (event, context, callback) => {
    //queryDB(AVG_MORNING, callback);
    //teste();
    processFile(process.env.FILE_NAME,callback);
    //callback({"status" : "finished"});

};

function processFile(filename, callback) {
    var params = {Bucket: process.env.BUCKET_NAME, Key: filename}
    var patientName = process.env.PATIENT;
    var table = process.env.TABLE_NAME;

    s3.getObject(params, function(err, data) {
    if (err) {
        console.log("Error accessing S3:" + err, err.stack); // an error occurred
        callback(err);
        return;
    }
    console.log("starting...")
    var stringao = data.Body.toString();
    var arr = stringao.split('\n');
    console.log(arr.length);
    for(var line=4;line<arr.length-1;line++) {
        //console.log(arr[line]);
        var fields = arr[line].split('\t');
        var ts = new Date(fields[1]);
        var id = fields[0];
        var time_stamp = ts.valueOf();
        var input_type = fields[2];
        var glucose_history = fields[3] ? fields[3] : 0;
        var glucose_readout = fields[4] ? fields[4] : 0;
        var fast_action_insulim_nAn = fields[5] ? fields[5] : "-";
        var fast_action_insulim_num = fields[6] ? fields[6] : 0;
        var food_nAn = fields[7] ? fields[7] : "-";
        var carbs = fields[8] ? fields[8] : 0;
        var long_acting_insulim_nAn = fields[9] ? fields[9] : "-";
        var long_acting_insulim_num = fields[10] ? fields[10] : 0;
        var obs = fields[11] ? fields[11] : "-";

        //console.log("ID " + id + " ts " + time_stamp + " readout " + glucose_readout + " carbs " + carbs);
     	var params = {
		    Item : {
	    	    "id" : uuid.v1(),
	    	    "gid" : id,
		    	"name" : patientName,
	    		"time_stamp" : time_stamp,
	    		"time_stamp_str" : ts.toISOString(),
	    		"time_stamp_hour" : ts.getHours(),
	    		"input_type" : input_type,
	            "glucose_history" : glucose_history,
	    		"glucose_readout" : glucose_readout,
	    		"fast_action_insulim_nAn" : fast_action_insulim_nAn,
	    		"fast_action_insulim_num" : fast_action_insulim_num,
	    	    "food_nAn" : food_nAn,
	    		"carbs" : carbs,
	    		"long_acting_insulim_nAn" : long_acting_insulim_nAn,
	    		"long_acting_insulim_num" : long_acting_insulim_num,
	    		"obs" : obs
	    	},
	    	TableName : table
    	};
        dynamoDB.put(params, function(err, data){
            if(err) {
                console.log("ERRO! " + err);
            }
        });
    }
    });
}
function readFile (bucketName, filename, onFileContent, onError) {
    var params = { Bucket: bucketName, Key: filename };
    s3.getObject(params, function (err, data) {
        if (!err)
            onFileContent(filename, data.Body.toString());
        else
            console.log(err);
    });
}

function readFileContent(filename, content) {
    //do something with the content of the file
}

function onError (err) {
    console.log('error: ' + err);
}