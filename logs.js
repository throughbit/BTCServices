'use strict';
//-o_O===modules===================================================~|
var fs = require('fs');
//-o_O===init======================================================~|
//-o_O===sign_tx()=================================================~|
function write_rec_log(status,data){
 const F_PATH = process.env.REC_LOG;
//status is a bool
//data is an object or a single txid for fail cases
 const time = new Date().getTime();
 var log_separator = "#--------------------------------------------------------------------------------------------------------------- ";
//--------------------------------------------------------------------
 if(status){
  const s_log={
   "time":time,
   "status": "success",
   "message": "Received Payments.",
   "txid": data.txid,
   "confirmations":data.confirmations,
   "receives": data.receives,
  }

  fs.appendFile(`${F_PATH}`,`${JSON.stringify(s_log,null,1)}\n${log_separator}\n`, function(err){
   if(err) console.log("Could not write to file: \n", err);
   else console.log("Success written to log.");
  });
 }
//--------------------------------------------------------------------
 else{
  const f_log={
   "time":time,
   "status": "fail",
   "message":`Error in reading receives`,
   "txid": data
  }
  fs.appendFile(`${F_PATH}`,`${JSON.stringify(f_log,null,1)}\n${log_separator}\n`, function(err){
   if(err) console.log("Could not write to file: \n", err);
   else console.log("Fail written to log.");
  });
 }
//--------------------------------------------------------------------
}
//-o_O===exports===================================================~|
module.exports={write_rec_log};
//-o_O===fin-======================================================~|
