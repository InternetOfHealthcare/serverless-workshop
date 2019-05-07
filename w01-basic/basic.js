'use strict';

module.exports.handler = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Go Serverless v1.0! Your function executed successfully!',
      input: event,
    }, null, 2),
  };
};

module.exports.bisiesto = async (event) => {
  var ano = 2000;
  var bisiesto = false;
  if((ano%4==0 && ano%100!=0) || ano%400==0) bisiesto = true;
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Año ' + ano + (bisiesto ? " és bisiesto." : " no és bisiesto."),
      input: event,
    }, null, 2),
  };
};
