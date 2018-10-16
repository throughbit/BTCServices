/*
Developed at ThroughBit Technologies Pvt.Ltd
HYFERx Project
Tx Parser: used in conjunction with wallet-notify
*/
//-o_O==========================================================~|
'use strict';
//-o_o===modules=================================================|
const errorSet = require('./errors.js');
const slack = require('./SlackNode.js');
const loggit = require('./logs.js');

const request = require('request');
const express = require('express');
const helmet = require('helmet');
const bodyParser = require('body-parser');
//-o_O===init===================================================~|
//Server created to respond to wallet_notify
const UPD_PORT = process.env.W_UPD;
//NodeServer: called to aquire tx_detail
const S_PORT = process.env.SERV;
const server_url = `http://localhost:${S_PORT}`;
//Path to log file

var app = express();

app.use(helmet());
app.use(helmet.noCache());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

//Object sent as a notification.

//Object sent to NodeServer to parse tx
var options = {
   headers:{ "content-type": "application/JSON" },
   url: `${server_url}/tx_detail_local`,
   method: 'POST',
   body:{},
   json: true
}
//-o_o===node-update==============================================|
//curled by wallet-notify
app.post('/node_update', (req,res)=>{
 try{
  //console.log(req.body.txid);
  tx_detail(req.body.txid)
  .then((data)=>{
   //console.log("Tx_details, fetched and parsed: \n",data.receives);
   //This is the parsed response that can be redirected to suite your application
   if(data.tx_details){
    let response = errorSet.errorFunc('success',data);
    console.log("here?",response);
    loggit.write_rec_log(true, data);
    slack.update_slack(JSON.stringify(data),'Receive Notifier');
    //notify orderbook
    res.send(response);
   }
   else {
    let response =  errorSet.errorFunc('fail', "Txid Has no wallet receives.");
    console.log("Receives came back  empty at  /node-update",response);
    res.send(response);
   }
  })
  .catch((err)=>{
   let response = errorSet.errorFunc("fail",err.message);
   console.log("Caught at /node-update",response);
   res.send(response);
  });
 }
 catch(e){
  let response = errorSet.errorFunc("fail",e);
  loggit.write_rec_log(false,req.body.txid);
  console.log("Caught at /node-update, final catch",response);
  res.send(response);
 }
});
//-o_o===tx-detail================================================|
function tx_detail(txid){
return new Promise((resolve,reject)=>{
 try{
  options.body = {"txid":txid};
  request.post(options,
   (error, response, body)=>{
    if(error){
     let respo = errorSet.errorFunc('fail',error);
     console.log("Error in response from tx_detail request",respo);
     reject(respo);
    }
   console.log(body);
   if(body.status){
    tx_parse(body.message)
    .then(responso=>{
     console.log("Responso back from tx_parse.\n",responso);
     resolve(responso);
    })
    .catch((err)=>{
     let responso = errorSet.errorFunc('fail',err.message);
     console.log("Caught at tx_detail().",responso);
     reject(responso);
    })
   }
   else { //tx_detail_local could send back a response that arrives as a body and carries an error
    let response = errorSet.errorFunc('fail',body.message);
    console.log("error in response received at /tx_detail of TxParser",response);
    reject(response);
   }
   });
  }
  catch(e){
   let response = errorSet.errorFunc('fail', e);
   console.log("Caught at tx_detail()",response);
   reject(response);
  }
 });
}
//-o_o===tx-parse================================================|
function tx_parse(data){
 return new Promise(async (resolve,reject)=>{
  try{
   var rec_set = {
    "txid":'',
    "confirmations":'',
    "tx_details":[]
   }
   rec_set.txid = data.txid;
   rec_set.confirmations = data.confirmations;
   console.log("The data to parse: ", data.details);
   rec_set.tx_details = data.details.map(async function(obj){
    //if(obj.category==='receive'){ //remove this to also notify about sends
    //console.log(obj.address);
    return ({"category": obj.category, "address":obj.address, "amount":obj.amount});
    //return (receives);
    //}
   });

   await Promise.all(rec_set.tx_details)
   .then((details)=>{
    rec_set.tx_details = details;
    //console.log("receives formatted:",rec_set);
    resolve(rec_set);
   })
   .catch((e)=>{
    let response = errorSet.errorFunc('fail',e);
    console.log("Caught at tx_parse\n",response);
    reject(e);
   });
  }
  catch(e){
   let response = errorSet.errorFunc('fail',e);
   console.log("Caught at tx_parse, final try.\n",response);
   reject(response);
  }
 });
}
//-o_o===CONNECT===================================================|
app.listen(UPD_PORT,()=>
 console.log(`Wallet Update Server running on port ${UPD_PORT}`)
);
//-o_o===fin==================================================|
