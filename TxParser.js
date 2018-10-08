/*
Tx Parser:
Developed at ThroughBit Technologies Pvt.Ltd
HYFERx Project
*/
//-o_O==========================================================~|
'use strict';
//-o_o===modules=================================================|
var request = require('request');
var errorSet = require('./errors.js');
var express = require('express');
var helmet = require('helmet');
var bodyParser = require('body-parser');
var rp = require ('request-promise-native');
var slack = require('./SlackNode.js');
//-o_O===init===================================================~|
const UPD_PORT = process.env.W_UPD;
//Server created to respond to wallet_notify
const S_PORT = process.env.SERV;
//Primary node interface Server called to aquire tx_detail
const server_url = `http://localhost:${S_PORT}`;
var app = express();

app.use(helmet());
app.use(helmet.noCache());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

var rec_set = {
 "txid":'',
 "confirmations":'',
 "receives":[]
}

var options = {
   "headers":{ "content-type": "application/JSON" },
   "url": `${server_url}/tx_detail_local`,
   "method": 'POST',
   "body":{},
   "json": true
  }
//-o_o===node-update======================================================|
app.post('/node-update', async (req,res)=>{
 try{
  console.log(req.body.txid);
  tx_detail(String(req.body.txid))
  .then(data=>{
   if(data.receives!==[{}]||data.receives!==[]){
    let response = errorSet.errorFunc('success',data);
    slack.update_slack(JSON.stringify(data),'Receive Notifier');
    res.send(response);
   }
   //How to cancel response incase of empty receives set i.e. incase notification is for sends
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
  let str = "txid=";
  let bodystring=str.concat(txid);
  console.log(bodystring);
  options.body = {"txid":txid};
  console.log(options);
  request.post(options,
   (error, response, body)=>{
    if(error){
     let respo = errorSet.errorFunc('fail',error);
     console.log(respo);
     reject(respo);
    }
   console.log(body);
   console.log(JSON.stringify(body));
    tx_parse(JSON.parse(body))
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
    console.log("The data to parse: ", data);
    rec_set.receives = data.message.details.map(async function(obj){
     if(data.message.details.category=='receive'){ //remove this to also notify about sends
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
