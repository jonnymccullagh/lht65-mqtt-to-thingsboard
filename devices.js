
function getAccessCode(device_name, getAccessCodeCallback) {

let mysql = require('mysql');
let config = require('./config.js');
 
let connection = mysql.createConnection(config.mysql_config);
let sql_count = 'SELECT COUNT(*) AS device_count FROM devices WHERE mikes_name=?';
connection.query(sql_count, [device_name], (error, results, fields) => {
  if (error) {
    return console.error(error.message);
  }
  console.log("Count query executed");
  if(results[0]['device_count'] > 0){
    let sql = `SELECT tb_access_code FROM devices WHERE mikes_name=?`;
    connection.query(sql, [device_name], (error, results, fields) => {
      if (error) {
        return console.error(error.message);
      }
      console.log("Query executed");
      if(typeof results !=='undefined' && results){
          access_code = results[0]['tb_access_code'];
          getAccessCodeCallback(null, access_code);
      }else{
        return
      }
  });

}; 
//});
  connection.end();
}); // end getAccessCode
}

function setDeviceTemperature(device_name, temperature, setDeviceTemperatureCallback) {

let mysql = require('mysql');
let config = require('./config.js');
 
let connection = mysql.createConnection(config.mysql_config);
let conn_fss = mysql.createConnection(config.fss_mysql_config);

let sql = `UPDATE devices SET latest_temp=?, latest_temp_date=NOW() WHERE mikes_name=?`;
let sql_fss = `UPDATE devices SET cooler_current_temp=?, cooler_date_latest=NOW() WHERE donard_label=?`;

connection.query(sql, [temperature, device_name], (error, results, fields) => {
  if (error) {
    return console.error(error.message);
  }
  console.log("Update temperature executed");
  setDeviceTemperatureCallback(null, temperature);
  return results[0];
});
connection.end();

conn_fss.query(sql_fss, [temperature, device_name], (error, results, fields) => {
    if (error) {
      return console.error(error.message);
    }
    console.log("Update temperature in FSS cookie DB executed");
    setDeviceTemperatureCallback(null, temperature);
    return results[0];
  });
conn_fss.end();


} // end setDeviceTemperature

module.exports.getAccessCode = getAccessCode;
module.exports.setDeviceTemperature = setDeviceTemperature;
