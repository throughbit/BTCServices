/*
HYFERx Project
Node Server
*/
//-<..>===========================================================~|
'use strict';
//-o_o===modules===================================================|
var errorSet = require('./errors.js');
var express = require('express');
var helmet = require('helmet');
var bodyParser = require('body-parser');
var rp = require ('request-promise-native');
//-o_o===init======================================================|
const S_PORT = process.env.SERV;
const NODE_PORT = process.env.NODE;
const RPC_AUTH = process.env.RPC_AUTH;
const nodeurl = `http://localhost:${NODE_PORT}`;

var app = express();
app.use(helmet());
app.use(helmet.noCache());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}));

var options = {
 method: 'POST',
 url: nodeurl,
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
//-o_o===getUTxO===================================================|
app.post('/get_utxo', async (req,res)=>{
 try{
  options.body.id = 'GetUTxO';
  options.body.method = 'listunspent';
  options.body.params = [];
  options.body.params.push(10);
  options.body.params.push(999999);
  options.body.params.push(req.body.addresses);
  
  await rp(options)
   .then((resp)=>{
    let response = errorSet.errorFunc("success",resp.result);
    res.send(response);
   })
   .catch((err)=>{
    if(err.cause){
     let response = errorSet.errorFunc("fail",err.cause);
     res.send(response);
    }
    if(err.error){
     let response = errorSet.errorFunc("fail",err.error.error.message);
     res.send(response);
    }
    else{
     let response = errorSet.errorFunc("fail",err);
     res.send(response);
    }
   });
 }
 catch(e){
   let response = errorSet.errorFunc("fail",e);
   res.send(response);
 }
});
//-o_o===AddressGen================================================|
app.post('/new_address', async (req,res)=>{
 try{
  options.body.id = 'NewAddress';
  options.body.method = 'getnewaddress';
  options.body.params = [];

  await rp(options)
   .then((resp)=>{
    let response = errorSet.errorFunc("success",resp.result);
    res.send(response);
   })
   .catch((err)=>{
    if(err.cause){
     let response = errorSet.errorFunc("fail",err.cause);
     res.send(response);
    }
    if(err.error){
     let response = errorSet.errorFunc("fail",err.error.error.message);
     res.send(response);
    }
    else{
     let response = errorSet.errorFunc("fail",err);
     res.send(response);
    }
   });
 }
 catch(e){
   let response = errorSet.errorFunc("fail",e);
   res.send(response);
 }
});
//-o_o===TxDetail-local==================================================|
//Gets TxDetails for local addresses
app.post('/tx_detail_local', async (req,res)=>{
 try{
  let txid =req.body.txid;
  options.body.method = 'gettransaction';
  options.body.params = [];
  options.body.params.push(txid);
  
  await rp(options)
  .then((resp)=>{
   let response = errorSet.errorFunc('success',resp.result);
    res.send(response);
  })
  .catch((err)=>{
   if(err.cause){
    //console.log("errcause",err.cause);
    let response = errorSet.errorFunc("fail",err.cause);
    res.send(response);
   }
   else if(err.error){
    //console.log("errerrror",err.error);
    let response = errorSet.errorFunc("fail",err.error.error.message);
    res.send(response);
    }
   else{
    //console.log("generalerr", err);
    let response = errorSet.errorFunc("fail",err);
    res.send(response);
   }
  });
 }
 catch(e){
  let response = errorSet.errorFunc('fail', e);
  res.send(response);
 }
});
//-o_o===TxDetail-global===================================================|v
app.post('/tx_detail_global', async (req,res)=>{
//Gets TxDetails for any transaction on the network
 try{
  raw_tx(req.body.txid)
  .then(async (hex)=>{
   options.body.method = 'decoderawtransaction';
   options.body.params = [];
   options.body.params.push(hex);
   
   await rp(options)
   .then((resp)=>{
    let response = errorSet.errorFunc('success',resp.result);
    res.send(response);
   })
   .catch((err)=>{
    if(err.cause){
     //console.log("errcause",err.cause);
     let response = errorSet.errorFunc("fail",err.cause);
     res.send(response);
    }
    else if(err.error){
     //console.log("errerrror",err.error);
     let response = errorSet.errorFunc("fail",err.error.error.message);
     res.send(response);
    }
    else{
     //console.log("generalerr", err);
     let response = errorSet.errorFunc("fail",err);
     res.send(response);
    }
   })//after awaiting rp(options)
  })//after fetching rawtxid
  .catch((err)=>{
   if(err.cause){
    let response = errorSet.errorFunc("fail",err.cause);
    res.send(response);
   }
   else if(err.error){
    let response = errorSet.errorFunc("fail",err.error.error.message);
    res.send(response);
   }
   else{
    let response = errorSet.errorFunc("fail",err);
    res.send(response);
   }
  });
 }
 catch(e){
  let response = errorSet.errorFunc('fail', e);
  res.send(response);
 }
});
//-o_o===GetRawTx--===============================================+=|
function raw_tx(txid){
 return new Promise(async (resolve,reject)=>{
  try{
   options.body.method = 'getrawtransaction';
   options.body.params = [];
   options.body.params.push(txid);

   await rp(options)
   .then((resp)=>{
    let response = errorSet.errorFunc('success',resp.result);
    resolve(response.message);
   })
   .catch((err)=>{
    if(err.cause){
     let response = errorSet.errorFunc("fail",err.cause);
     reject(response);
    }
    if(err.error){
     let response = errorSet.errorFunc("fail",err.error.error.message);
     reject(response);
    }
    else{
     let response = errorSet.errorFunc("fail",err);
     reject(response);
    }
   });
  }
  catch(e){
   let response = errorSet.errorFunc('fail', e);
   reject(response);
  }
 });
}
//-o_o===Broadcast=================================================|
app.post('/broadcastx', async (req,res)=>{
 try{
  options.body.id='BroadcastTx';
  options.body.method='sendrawtransaction';
  options.body.params = [];
  options.body.params.push(req.body.hex);

  await rp(options)
  .then((resp)=>{
   res.send(resp);
  })
  .catch((err)=>{
   if(err.cause){
    let response = errorSet.errorFunc('fail',err.cause);
    res.send(response);
   }
   if(err.error){
    let response = errorSet.errorFunc('fail',err.error.error.message);
    res.send(response);
   }
   else{
    let response = errorSet.errorFunc('fail',err);
    res.send(response);
   }
  });
 }
 catch(e){
   let response = errorSet.errorFunc('fail',e);
   res.send(response);
 }
});
//-o_o===CONNECT===================================================|
app.listen(S_PORT,()=>
 console.log(`Node Server running on port ${S_PORT}`)
);
//-o_o===fin=======================================================|
