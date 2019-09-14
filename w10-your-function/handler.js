'use strict';

var AWS = require('aws-sdk');
const uuid = require('uuid');
const Alexa = require('alexa-sdk');
const iotData = new AWS.IotData({ endpoint: "a2p4fyajwx9lux.iot.us-east-1.amazonaws.com" });
const dynamoDB = new AWS.DynamoDB.DocumentClient();
const config = {};
const SkillMessagesES = {
    'welcome'       :'Bienvenido as Cosas Locas Conectadas, que chévere!',
    'help'          :'puedes preguntarme sobre tu estado de glucosa',
    'cancel'        :'adiós',
    'stop'          :'adiós',
    'try_again'		:'inténtalo de nuevo',
    'hello'			:'hola amigos de panamá, bienvenidos a nuestro workshop!',
    'no_register'	:'No tengo registros en este momento!',
    'avg_glucose'	:'Su glucosa promedio es',
    'avg_glucose_h' :'Su glucosa promedio a las ',
    'add_glucose'   :'Valor de glucosa añadido a la base de datos',
    'robot_command' :'Vale!',
    'is'		    :'és'
};


var SkillMessages = {};

exports.hello = function(event, context, callback) {
    var alexa = Alexa.handler(event, context);
    alexa.registerHandlers(handlers);
    SkillMessages = SkillMessagesES;
    alexa.execute();
};

var handlers = {
    'LaunchRequest': function () {
        this.emit('MyIntent');
    },
    'MyIntent': function () {
        this.response.speak(SkillMessages.welcome).listen(SkillMessages.try_again);
        this.emit(':responseReady');
    },

    'say_hello_meetup': function () {
        this.response.speak(SkillMessages.hello);
        this.emit(':responseReady');
    },
    'automation_light_on': function () {
	var payload = { "command" : "lighton"} 

        sendMQTTMessage(res=> {
            if(res=="ok") {
                this.response.speak(SkillMessages.robot_command);
                this.emit(':responseReady');
            }
        },"iothub/lighton",JSON.stringify(payload));

    },
    'automation_light_off': function () {
	var payload = { "command" : "lightoff"} 

        sendMQTTMessage(res=> {
            if(res=="ok") {
                this.response.speak(SkillMessages.robot_command);
                this.emit(':responseReady');
            }
        },"iothub/lightoff",JSON.stringify(payload));

    },


    'shelf_inventory': function () {
	var payload = { "command" : "inventory"} 

        sendMQTTMessage(res=> {
            if(res=="ok") {
                this.response.speak(SkillMessages.robot_command);
                this.emit(':responseReady');
            }
        },"smartshelf/inventory",JSON.stringify(payload));

    },

    'shelf_checkout': function () {
	var payload = { "command" : "checkout"} 

        sendMQTTMessage(res=> {
            if(res=="ok") {
                this.response.speak(SkillMessages.robot_command);
                this.emit(':responseReady');
            }
        },"smartshelf/checkout",JSON.stringify(payload));

    },

    'count_people': function () {
	var payload = { "command" : "count"} 

        sendMQTTMessage(res=> {
            if(res=="ok") {
                this.response.speak(SkillMessages.robot_command);
                this.emit(':responseReady');
            }
        },"brbot/picture",JSON.stringify(payload));

    },


    'robot_control': function () {
	var direction = this.event.request.intent.slots.direction.value;
	var delay = this.event.request.intent.slots.delay.value;
	console.log(direction);
	console.log(delay);

	delay = parseInt(delay);
	delay = delay* 1000;
	console.log("delay :" + delay);

	if(direction=="adelante") direction="forward";
	else if(direction=="de regreso") direction="backward";
	else direction="forward";
	var payload = { "command" : direction, 
			"frequency" : 30, 
			"delay" : delay};
	console.log(JSON.stringify(payload));

        sendMQTTMessage(res=> {
            if(res=="ok") {
                this.response.speak(SkillMessages.robot_command);
                this.emit(':responseReady');
            }
        },"robot/control",JSON.stringify(payload));

    },

    'glucose_status_hour': function () {
        readAvg(data=> {
            var v = this.event.request.intent.slots.hour.value;
            data = JSON.parse(data);
            var txt;
            if(data['h' +v]==null) txt=SkillMessages.no_register;
            else txt = SkillMessages.avg_glucose_h + v + " " + SkillMessages.is + " " + data['h' + v];
            this.response.speak(txt).listen(txt);
            this.emit(':responseReady');
        })
    },
    'glucose_add': function () {
    	var name = process.env.PATIENT;
        var v = this.event.request.intent.slots.glucosa.value;

	  	add_glucose(data=> {
            console.log(data);
            this.response.speak(SkillMessages.add_glucose).listen(SkillMessages.help);
            this.emit(':responseReady');
        }, name, v);
    },
    
    'glucose_status': function () {
        readAvg(data=> {
            console.log(data);
            data = JSON.parse(data);
            var txt = SkillMessages.avg_glucose + " " + data.glucose_avg;
            this.response.speak(txt).listen(txt);
            this.emit(':responseReady');
        })
    },
    'AMAZON.HelpIntent': function () {
        this.response.speak(SkillMessages.help).listen(SkillMessages.help);
        this.emit(':responseReady');

    },
    'AMAZON.StopIntent': function () {
        this.response.speak(SkillMessages.stop);
        this.emit(':responseReady');

    },
    'AMAZON.CancelIntent': function () {
        this.response.speak(SkillMessages.cancel);
        this.emit(':responseReady');
    },
    'SessionEndedRequest': function() {
        this.emit('AMAZON.StopIntent');
    },
    'Unhandled': function() {
        this.response.speak(SkillMessages.help).listen("teste");
        this.emit(':responseReady');
    }

};

function add_glucose(callback, name, glucose) {
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
        TableName : process.env.TABLE_NAME
    };
    dynamoDB.put(params, function(err, data){
    	callback(err, data);
    });
   

}
function readAvg(callback) {
    var table = process.env.TABLE_NAME;
    var name = process.env.PATIENT;
    console.log(name);
    var params;

    params = {
        TableName: table,
        ProjectionExpression: "input_type, glucose_readout, time_stamp_hour",
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

    dynamoDB.scan(params, function(err, data) {
        if (err) {
            console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
        } else {
            var avg = 0;
            var totalElements = data.Items.length;
            var totalGlucose = 0;
            var hours_value =[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
            var hours_entries =[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
            var hour=0, readout=0;
            console.log("Number of records " + totalElements);
            for(var x=0;x<data.Items.length;x++) {
                hour = data.Items[x].time_stamp_hour;
                readout = parseInt(data.Items[x].glucose_readout);
                hours_value[hour]+=readout;
                hours_entries[hour]++;
                totalGlucose = totalGlucose + readout;
            }
            avg =parseInt(totalGlucose/totalElements);
            var responseData;
            responseData = '{ "glucose_avg" : ' + avg + ',';
            for(var x=0;x<24;x++) {
                if(hours_value[x]!=null && hours_value[x]>0) {
                    responseData+= '"h' + x +'" : ' + parseInt(hours_value[x] / hours_entries[x]) + ',';
                }
            }
            responseData = responseData.substring(0,responseData.length-1);
            responseData +="}"
            callback(responseData);
        }
    });
}

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

