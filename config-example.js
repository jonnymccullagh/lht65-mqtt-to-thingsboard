var mysql_config = {
    host     : 'localhost',
    database : 'devices',
    user     : 'root',
    password : '',
    port     : '3306'
};
var broker_config = {
	address: "mqttserver.somewhere.com",
	port: 1883,
    username: "mqttuser",
    password: "opensesame",
    keepalive: 60,
    reconnectPeriod: 1000,
    clean: true,
    encoding: 'utf8'
};
var broker_topic = "application/9/device/+/+"

var thingsboard_config = {
	address: "http://thingsboard.somwhere.com:8080",

};
module.exports = {mysql_config: mysql_config, broker_config: broker_config, broker_topic: broker_topic, thingsboard_config: thingsboard_config};
