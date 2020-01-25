var baseConvert = require('baseconvert');
var hexToBinary = require('hex-to-binary');
var mqtt = require('mqtt')
var request = require("request")

let config = require('./config.js');
var devices = require('./devices');

var client = mqtt.connect('mqtt://' + config.broker_config.address, config.broker_config)

client.on('connect', function() { // When connected
    var now = new Date();
    console.log(now.toISOString() + " connected to MQTT server");
    console.log("Subscribing to " + config.broker_topic)
    client.subscribe(config.broker_topic, function() {
        // when a message arrives, do something with it
        client.on('message', function(topic, message, packet) {
    	    objMessage = JSON.parse(message);
            deviceName = objMessage.deviceName;
            deviceEUI = objMessage.devEUI;
            data = objMessage.data;
            console.log("**** " + deviceName + " ****")
            now = new Date();
            console.log(now.toISOString() + " Received '" + message + "' on '" + topic + "'");
	    if(data){
            buffer = Buffer.from(data, 'base64');
            data_as_hex = buffer.toString('hex');
            // ---- Get Internal Temperature -----
            temp_as_hex=data_as_hex.slice(4,8)
            temp_as_int=parseInt(temp_as_hex, 16)
            if(temp_as_int > 1250){
                internal_temp_as_dec=(temp_as_int-65536)/100
            }else{
                internal_temp_as_dec=temp_as_int/100
            }
            console.log("Internal Temperature:" + temp_as_int + " converted to " + internal_temp_as_dec)

            // ---- Get External Temperature -----
            temp_as_hex=data_as_hex.slice(14,18)
            temp_as_int=parseInt(temp_as_hex, 16)
            external_temp_as_dec=temp_as_int/100
            if(external_temp_as_dec == 327.67){ 
                console.log("External Temperature:Not connected (" + external_temp_as_dec + ")");
            }else{
                console.log("External Temperature:" + external_temp_as_dec)
            }
            // ---- Get Humidity -----

            humidity_as_hex=data_as_hex.slice(8,12)
            humidity_as_int=parseInt(humidity_as_hex, 16)
            humidity_as_dec=humidity_as_int/10
            console.log("Humidity:" + humidity_as_dec)

            // ---- Get Battery Status -----

            var hexString = data_as_hex.slice(0,4);
            var binaryString = hexToBinary(hexString);
            status_bits = binaryString.slice(0,2);
            var status_as_dec = baseConvert.bin2dec(status_bits);
            if(status_as_dec < 2 ){
                status_as_string = "Warning"
            }else{
                status_as_string = "OK"
            }
            console.log("Battery Status:" + status_as_string)
            // ---- Get Battery Voltage -----

            voltage_bits=binaryString.slice(2,16);
            var voltage_as_dec = baseConvert.bin2dec(voltage_bits)/1000;
            console.log("Battery Voltage:" + voltage_as_dec)

            // create array to store readings


            json_for_tb = {
                'internal_temp': internal_temp_as_dec,
                'external_temp': external_temp_as_dec,
                'humidity': humidity_as_dec,
                'battery_status': status_as_string,
                'battery_voltage': voltage_as_dec,
            };
            //payload_for_tb = JSON.stringify(dict_of_values);
	    //console.log(payload_for_tb);

        devices.getAccessCode(deviceName, function(err, access_code){
            if(err){
                console.log(err);
                return;
            }
            console.log("Thingsboard access code is: " + access_code);
            if(access_code){
                thingsboard_url = config.thingsboard_config.address + "/api/v1/" + access_code + "/telemetry"
                request.post({
                    url: thingsboard_url,
                    json: json_for_tb,
                }, function (error, response, body) {
                    if (!error && response.statusCode === 200) {
                        console.log("Thingsboard response.statusCode: " + response.statusCode)
                    }else{
                        console.log("error: " + error)
                        console.log("Thingsboard response.statusCode: " + response.statusCode)
                    }
                }) // end of request->post
                devices.setDeviceTemperature(deviceName, internal_temp_as_dec, function(err, access_code){
                    if(err){
                        console.log(err);
                        return;
                    }
                    console.log("Set temperature of " + deviceName + " to " + internal_temp_as_dec + " in MySQL" );
                }); // end set device temp in mysql

            }//end if we got an access code
        }); // end get device access code

	   } // end if data

        });
    });
});

client.on('error', function(err) {
    console.log(err);
});

