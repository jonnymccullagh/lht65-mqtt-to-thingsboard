
function getAccessCode(device_name, getAccessCodeCallback) {

let mysql = require('mysql');
let config = require('./config.js');
 
let connection = mysql.createConnection(config.mysql_config);
 
let sql = `SELECT tb_access_code FROM devices WHERE mikes_name=?`;
connection.query(sql, [device_name], (error, results, fields) => {
  if (error) {
    return console.error(error.message);
  }
  console.log("Query executed");
  if(typeof results[0]['tb_access_code'] !=='undefined' && results){
  	access_code = results[0]['tb_access_code'];
  	getAccessCodeCallback(null, access_code);
  }else{
  	return
  }
});
  connection.end();
} // end get_device_access_code

function setDeviceTemperature(device_name, temperature, setDeviceTemperatureCallback) {

let mysql = require('mysql');
let config = require('./config.js');
 
let connection = mysql.createConnection(config.mysql_config);
 
let sql = `UPDATE devices SET latest_temp=?, latest_temp_date=NOW() WHERE mikes_name=?`;
connection.query(sql, [temperature, device_name], (error, results, fields) => {
  if (error) {
    return console.error(error.message);
  }
  console.log("Update temperature executed");
  setDeviceTemperatureCallback(null, temperature);
  return results[0];
});
  connection.end();
} // end get_device_access_code


module.exports.getAccessCode = getAccessCode;
module.exports.setDeviceTemperature = setDeviceTemperature;
