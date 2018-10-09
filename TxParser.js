/*
Tx Parser:
Developed at ThroughBit Technologies Pvt.Ltd
HYFERx Project
*/
//-o_O==========================================================~|
'use strict';
//-o_o===modules=================================================|
const request = require('request');
const express = require('express');
const helmet = require('helmet');
const bodyParser = require('body-parser');
var fs = require('fs');
const slack = require('./SlackNode.js');
var errorSet = require('./errors.js');
//-o_O===init===================================================~|
//Server created to respond to wallet_notify
const UPD_PORT = process.env.W_UPD;
//NodeServer: called to aquire tx_detail
const S_PORT = process.env.SERV;
const server_url = `http://localhost:${S_PORT}`;
//Path to log file
const F_PATH = process.env.REC_LOG;

var app = express();

app.use(helmet());
app.use(helmet.noCache());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

//Object sent as a notification. 
var rec_set = {
 "txid":'',
 "confirmations":'',
 "receives":[]
}
//Object sent to NodeServer to parse tx
var options = {
   headers:{ "content-type": "application/JSON" },
   url: `${server_url}/tx_detail_local`,
   method: 'POST',
   body:{},
   json: true
}
//-o_o===node-update======================================================|
app.post('/node-update', async (req,res)=>{
 try{
  //console.log(req.body.txid);
  tx_detail(String(req.body.txid))
  .then(data=>{
   //This is the parsed response that can be redirected to suite your application
   if(data.receives!==[{}]||data.receives!==[]){
    let response = errorSet.errorFunc('success',data);
    fs.writeFile("${F_PATH}","${data}\n", function(err){
     if(err) console.log("Could not write to file: \n", err);
     else console.log("Notification logged");
    });
    slack.update_slack(JSON.stringify(data),'Receive Notifier');
    res.send(response);
   }
  })
 }
 catch(e){
  let response = errorSet.errorFunc("fail",e);
  console.log(response);
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
     console.log(respo);
     reject(respo);
    }
   // console.log(JSON.parse(body));
    tx_parse(body)
    .then(responso=>{
     resolve(responso);
    })
    .catch(err=>{
     let responso = errorSet.errorFunc('fail',err);
     console.log(responso);
     reject(responso);
    })
   });
  }
  catch(e){
   let response = errorSet.errorFunc('fail', e);
   console.log(response);
   reject(response);
  }
 });
}
//-o_o===tx-parse================================================|
function tx_parse(data){
 return new Promise(async (resolve,reject)=>{
  try{
    rec_set.txid = data.message.txid;
    rec_set.confirmations = data.message.confirmations;
    rec_set.receives = [];
    console.log("The data to parse: ", data.message.details);
    rec_set.receives = data.message.details.map(async function(obj){
     if(obj.category=='receive'){ //remove this to also notify about sends
      let receives = {"address":obj.address, "amount":obj.amount};
      return (receives);
     }
    });
   
    await Promise.all(rec_set.receives)
    .then((thesereceives)=>{
     rec_set.receives = thesereceives;
     resolve(rec_set);
    })
    .catch((e)=>{
     let response = errorSet.errorFunc('fail',e);
     console.log(response);
     reject(e);
    });
  } 
  catch(e){
   let response = errorSet.errorFunc('fail',e);
   console.log(response);
   reject(response);
  }
 });
}
//-o_o===CONNECT===================================================|
app.listen(UPD_PORT,()=>
 console.log(`Wallet Update Server running on port ${UPD_PORT}`)
);
//-o_o===fin==================================================|
