/*
HYFERx Project
Tx Parser
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
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}));

var rec_set = {
 "txid":'',
 "confirmations":'',
 "receives":[]
}
//-o_o===node-update======================================================|
app.post('/node-update', async (req,res)=>{
 try{
  tx_detail(req.body.txid)
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
  res.send(response);
 }
});
//-o_o===tx-detail================================================|
function tx_detail(txid){
return new Promise((resolve,reject)=>{
 try{
  request.post({
   "headers":{ "content-type": "application/json" },
   "url": `${server_url}/tx_detail_local`,
   "body": JSON.stringify({"txid":txid})
  },
   (error, response, body)=>{
    if(error){
     let respo = errorSet.errorFunc('fail',error);
     reject(respo);
    }
    tx_parse(JSON.parse(body))
    .then(responso=>{
     resolve(responso);
    })
    .catch(err=>{
     reject(err);
    })
   });
  }
  catch(e){
   let response = errorSet.errorFunc('fail', e);
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
   
    rec_set.receives = data.message.details.map(async function(obj){
     if(data.message.details.category==='receive'){
      let receives = {"address":obj.address, "amount":obj.amount};
      console.log(receives);
      return (receives);
     }
    });
   
    await Promise.all(rec_set.receives)
    .then((thesereceives)=>{
     rec_set.receives = thesereceives;
     resolve(rec_set);
    })
    .catch((e)=>reject(e));
  } 
  catch(e){
   reject(e);
  }
 });
}
//-o_o===CONNECT===================================================|
app.listen(UPD_PORT,()=>
 console.log(`Wallet Update Server running on port ${UPD_PORT}`)
);
//-o_o===fin==================================================|
