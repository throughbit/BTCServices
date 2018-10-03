/*
HYFERx Project
Digibyte node server
*/
//-o_O============================================================~|
'use strict';
//-o_o===modules===================================================|
const digibyte = require('digibyte');
var errorSet = require('./errors.js');
var express = require('express');
var helmet = require('helmet');
var bodyParser = require('body-parser');
var rp = require ('request-promise-native');
//-o_o===init======================================================|
const S_PORT = process.env.SERV;
const NODE_PORT = process.env.NODE;
const RPC_AUTH = process.env.RPC;
const digiurl = `http://localhost:${NODE_PORT}`;
var app = express();

app.use(helmet());
app.use(helmet.noCache());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}));

var addresses = ['DJ6FfMCxdUC6vAYvN9yJNd5Quok8AYW9PR'];

var options = {
 method: 'POST',
 url: digiurl,
 headers:
 {
  Authorization: 'Basic ' + RPC_AUTH,
  'Content-Type': 'application/json'
 },
 body:
 {
  jsonrpc: '1.0',
  id: '',
  method: '',
  params:[]
 },
 json: true
};
//-o_o===UTXO======================================================|
app.post('/get_utxo', async (req,res)=>{
 try{
  options.body.id = 'GetUTxO';
  options.body.method = 'listunspent';
  options.body.params = [6,9999999,addresses];
  await rp(options)
   .then((resp)=>{
    //console.log(resp.result);
    let response = errorSet.errorFunc("success","UTxOSet Delivered");
    res.send(response, res.result);
   })
   .catch((err)=>{
    if(err.statusCode==401){
     console.log("Error: RPC Authorization failure");
     res.status(401).send({"code":401,"message":"Authorization failure"});
    }
    if(err.cause){
     if(err.cause.code==="ECONNREFUSED"){
     console.log("Error: Daemon not running");
     res.status(500).send({"err":"Daemon not running"});
     }
    }
    else{
     console.log(err.error.error.message);
    }
   });
 }
 catch(e){
   let reponse = errorSet.errorFunc("fail","fcatch");
   console.log({Failed:response,Specification:e});
   res.send({Failed:response,Specification:e});
   return ({Failed:response,Specification:e});
 }
});
//-o_o===AddressGen================================================|
app.post('/new_address', async (req,res)=>{
 console.log('imin');
 try{
  options.body.id = 'NewAddress';
  options.body.method = 'getnewaddress';
  await rp(options)
   .then((resp)=>{
    //console.log(resp.result);
    let response = errorSet.errorFunc("success","UTxOSet Delivered");
    res.send(response,resp.result);
   })
   .catch((err)=>{
    if(err.statusCode==401){
     console.log("Error: RPC Authorization failure");
     res.status(401).send({"code":401,"message":"Authorization failure"});
    }
    if(err.cause){
     if(err.cause.code==="ECONNREFUSED"){
     console.log("Error: Daemon not running");
     res.status(500).send({"err":"Daemon not running"});
     }
    }
    else{
     console.log(err.error.error.message);
    }
   });
 }
 catch(e){
   let reponse = errorSet.errorFunc("fail","fcatch");
   console.log({Failed:response,Specification:e});
   res.send({Failed:response,Specification:e});
   return ({Failed:response,Specification:e});
 }
});
//-o_o===TxDetail==================================================|
app.post('/tx_detail', async (req,res)=>{
 try{
  options.body.id = 'GetTransaction';
  options.body.method = 'gettransaction';
  let regex = new RegExp(/[a-zA-Z0-9]{64}/);
  let txid = req.body.txid;
  if(regex.test(txid)) options.body.params.push(txid);
  else res.send(errorSet.errorFunc("fail","Invalid TxId"));

  await rp(options)
   .then((resp)=>{
    //console.log(resp.result);
    let response = errorSet.errorFunc("success","UTxOSet Delivered");
    res.send( resp.result);
   })
   .catch((err)=>{
    if(err.statusCode==401){
     let response = errorSet.errorFunc("fail","Error: RPC Authorization failure");
     res.status(401).send(response,{"code":401,"message":"Authorization failure"});
    }
    if(err.cause){
     if(err.cause.code==="ECONNREFUSED"){
     let response = errorSet.errorFunc("fail","Error: Daemon not running");
     res.status(500).send(response,{"err":"Daemon not running"});
     }
    }
    else{
     let response = errorSet.errorFunc("fail",err.error.error.message);
     res.send(response);
    }
   });
 }
 catch(e){
   let response = errorSet.errorFunc("fail","fcatch");
   res.send({Failed:response,Specification:e});
 }
});
//-o_o===Broadcast=================================================|
app.post('/broadcastx', async (req,res)=>{
 try{
  options.body.id='BroadcastTx';
  options.body.method='sendrawtransaction';
  let parameters = [];
  parameters.push(req.body.hex);
  options.body.params = parameters;

  console.log(options);
  await rp(options)
   .then((resp)=>{
    console.log(resp);
    res.send(resp);
   })
   .catch((err)=>{
    if(err.statusCode==401){
     console.log("Error: RPC Authorization failure");
     res.status(401).send({"code":401,"message":"Authorization failure"});
    }
    if(err.cause){
     if(err.cause.code==="ECONNREFUSED"){
     console.log("Error: Daemon not running");
     res.status(500).send({"err":"Daemon not running"});
     }
    }
    else{
     console.log(err.error.error.message);
     res.status(500).send({"code":err.error.error.code,"message":err.error.error.message});
    }
   });
 }
 catch(e){
   fail_response.message = fail.fcatch;
   console.log(fail_response,e);
   res.send(fail_response,e);
 }
});
//-o_o===CONNECT===================================================|
app.listen(S_PORT,()=>
 console.log(`Node Server running on port ${S_PORT}`)
);
//-o_o===fin=======================================================|
