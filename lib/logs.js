/*
Logs

Developed at ThroughBit Technologies Pvt.Ltd
HYFERx Project
*/
//-o_O==========================================================~|
'use strict';
//-o_O===modules===================================================~|
const fs = require('fs');
//-o_O===init======================================================~|
//-o_O===sign_tx()=================================================~|
let receives = (status,data) =>{
 const L_PATH = process.env.DREC_LPATH;
//status is a bool
//data is an object or a single txid for fail cases
 const log_separator = "#--------------------------------------------------------------------------------------------------------------- ";
//--------------------------------------------------------------------
 if(status){
  const s_log={
   "time":new Date(unix_timestamp * 1000).format('h:i:s'),
   "status": "success",
   "message": "Received Payments.",
   "txid": data.txid,
   "confirmations":data.confirmations,
   "tx_details": data.tx_details,
  }

  fs.appendFile(`${L_PATH}`,`${JSON.stringify(s_log,null,1)}\n${log_separator}\n`, function(err){
   if(err) console.log("Could not write to file: \n", err);
   else console.log(`Successfully written receives to log @ ${L_PATH}`);
  });
 }
//--------------------------------------------------------------------
 else{
  const f_log={
   "time":new Date(unix_timestamp * 1000).format('h:i:s'),
   "status": "fail",
   "message":`Error in reading receives`,
   "txid": data
  }
  fs.appendFile(`${L_PATH}`,`${JSON.stringify(f_log,null,1)}\n${log_separator}\n`, function(err){
   if(err) console.log("Could not write to file: \n", err);
   else console.log("Fail written to log.");
  });
 }
//--------------------------------------------------------------------
}
//-o_O===exports===================================================~|
module.exports={receives};
//-o_O===fin-======================================================~|
