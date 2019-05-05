'use strict';
var AWS = require('aws-sdk');

module.exports.run =  async(event) => {
  console.log(event.queryStringParameters.source);
  console.log(event.queryStringParameters.target);
  console.log(event.queryStringParameters.text);
  var source = event.queryStringParameters.source;
  var target = event.queryStringParameters.target;
  var text = event.queryStringParameters.text;
  
  var res = await translate(source,target, text);
  console.log(res.TranslatedText);
  return {
    statusCode: 200,
    body: JSON.stringify({
      translatedText: res.TranslatedText,
    }, null, 2),
  };
};


async function translate(source, destination, text) {
    var tr = new AWS.Translate();
    var params = {
        SourceLanguageCode: source, /* required */
        TargetLanguageCode: destination, /* required */
        Text: text /* required */
    };
    var res = tr.translateText(params).promise();
    return res;
}
