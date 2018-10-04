/*
HYFERx Project
Digibyte Tx Parser
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

var txidTest='bea1dfd606d52968816bafa5ec034ca0adfdc650e6e0c83f3dba1d2a58779d64'
var add_am = {
 "address":[],
 "amount":''
}
//-o_o===node-update======================================================|
app.post('/node-update', async (req,res)=>{
 try{
  tx_detail(txidTest)
  .then(data=>{
   let response = errorSet.errorFunc('success',data);
  // console.log(response);
   res.send(response);
  })
 }
 catch(e){
   let response = errorSet.errorFunc("fail",e);
  // console.log(response);
   res.send(response);
 }
});
//-o_o===tx-detail================================================|
function tx_detail(txid){
return new Promise((resolve,reject)=>{
 try{
   request.post({
    "headers":{ "content-type": "application/json" },
    "url": `${server_url}/tx_detail`,
    "body": JSON.stringify({"txid":txid})
   },(error, response, body)=>{
    if(error){
    let respo = errorSet.errorFunc('fail',error);
    reject(respo);
    }
//    console.log("BODY",body);
  //  console.log("RESPONSE",response);
    tx_parse(JSON.parse(body))
    .then(responso=>{
     resolve(responso);
    })
    .catch(err=>{
     console.log(err);
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
 return new Promise((resolve,reject)=>{
  try{
  add_am.address = data.message.vout[1].scriptPubKey.addresses;
  add_am.amount = data.message.vout[1].value;
   resolve(add_am);
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
