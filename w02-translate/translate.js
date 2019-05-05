'use strict';

var AWS = require('aws-sdk');

module.exports.run = (event, context, callback) => {
  translate(res=> {
  	  console.log(res);
    },"en", "es", "Hello good morning");
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

function translate(callback, source, destination, text) {
    var translate = new AWS.Translate();
    var params = {
        SourceLanguageCode: source, /* required */
        TargetLanguageCode: destination, /* required */
        Text: text /* required */
    };
    translate.translateText(params, function(err, data) {
        if (err) { 
            console.log(err, err.stack); // an error 
            callback("error");
        }
        else     {
            callback(data.TranslatedText);
        }
    });

}
