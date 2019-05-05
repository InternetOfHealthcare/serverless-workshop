'use strict';
var AWS = require('aws-sdk');
const uuid = require('uuid');
const dynamoDB = new AWS.DynamoDB.DocumentClient();
const table = "health_glucose";

module.exports.run = async (event) => {
  var res1 = await add_glucose("Francisco Xavier", 102);
  var res2 = await read_glucose("Francisco Xavier");

  console.log(res1);
  console.log(res2);
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Go Serverless v1.0! Your function executed successfully!',
      input: event,
    }, null, 2),
  };

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};

module.exports.read = async (event) => {
  var name = event.queryStringParameters.name;

  var result = await read_glucose(name);

  //	console.log(res2);
  return {
    statusCode: 200,
    body: JSON.stringify({
    	result
    }, null, 2),
  };

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};

module.exports.add_glucose = async(event) => {
    var name = event.queryStringParameters.name;
    var glucose = event.queryStringParameters.glucose;
    var dater =  new Date();

    var params = {
        Item : {
            "id" : uuid.v1(),	
            "name" : name,
            "glucose_readout" : glucose,
            "input_type" : "1",
            "time_stamp_str" : dater,
            "time_stamp" : dater.getTime(),
            "time_stamp_hour" : dater.getHours()	
        },
        TableName : table
    };
    const r = dynamoDB.put(params).promise();
    return r;

}	
async function read_glucose(name) {
    var params,params1;

    params = {
        TableName: table,
        ProjectionExpression: "input_type, glucose_readout, time_stamp_str",
        
        FilterExpression: "#t = :v and #name = :namev",
        ExpressionAttributeNames: {
            "#t": "input_type",
            "#name" : "name",
        },
        ExpressionAttributeValues: {
             ":v": "1",
             ":namev" : name
        }
    };
    params1 = {
        TableName: table,
    };

	try {
	  const data = dynamoDB.scan(params).promise();
	  return data;
      //return { statusCode: 200, body: JSON.stringify(data) };
	} catch (error) {
	  return {
	    statusCode: 400,
	    error: `Could not fetch: ${error.stack}`
	  };
	}
}
