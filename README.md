# lht65-mqtt-to-thingsboard
Node code to take the readings from a Dragino LHT65 and post the results to a Thingsboard installation
## Background
The main reason for posting this code is because I found little practical code online about the LHT65 so I hope this helps others.
Take what you need from it for your purpose and if you make it better please fork or re-post elsewhere according to the license. 
The code is pretty ugly and could do with refactoring into functions and modules to improve readability but I am pushed for time.
## What it does 
This code connects to an MQTT server and subscribes to a topic. When a message is received we pull out the data sent by the LHT65.
We then convert the base64 encoded data packet to hex, then convert chunks of the hex to decimal to get the numbers for each reading.
The battery status is more convoluted as it requires converting the hex chunk to binary with bits 1 and 2 providing a status code and
the remaining 6 bits provide the voltage. 
Once we have the LHT65 readings I check a MySQL database for the device name. If known we retrieve a thingsboard access code from that
MySQL database so that it can be used to post the readings to a thingsboard installation. 

## Getting Started
You'll need to 'npm install' the required modules (e.g. mqtt, request, mysql). Also rename the config-example.js to config.js and add settings for
the MySQL connection, the MQTT connection and the Thingsboard server. 

