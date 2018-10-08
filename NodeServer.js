/*
Node Server
Developed at ThroughBit Technologies Pvt. Ltd.
HYFERx Project
Requires: 
-Input checks: 
although no harm done without input sanitization:-
nothing you could pass instead of txid/hex/address that would compromise the interface or the underlying node.
-Review of error handling
-Review of aync behaviour
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
app.use(bodyParser.json(({ type: 'application/*+json' })))
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
//-o_o===listunspent===================================================|
app.post('/get_utxo', async (req,res)=>{
 try{
  options.body.id = 'GetUTxO';
  options.body.method = 'listunspent';
  options.body.params = [];
  options.body.params.push(10);
  options.body.params.push(999999);
  let addresses = req.body.addresses;
  options.body.params.push(addresses);
  
  await rp(options)
   .then((resp)=>{
    let response = errorSet.errorFunc("success",resp.result);
    res.send(response);
   })
   .catch((err)=>{
    if(err.cause){
     let response = errorSet.errorFunc("fail",err.cause);
     console.log(response);
     res.send(response);
    }
    if(err.error){
     let response = errorSet.errorFunc("fail",err.error.error.message);
     console.log(response);
     res.send(response);
    }
    else{
     let response = errorSet.errorFunc("fail",err);
     console.log(response);
     res.send(response);
    }
   });
 }
 catch(e){
   let response = errorSet.errorFunc("fail",e);
   console.log(response);
   res.send(response);
 }
});
//-o_o===getnewaddress================================================|
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
     console.log(response);
     res.send(response);
    }
    if(err.error){
     let response = errorSet.errorFunc("fail",err.error.error.message);
     console.log(response);
     res.send(response);
    }
    else{
     let response = errorSet.errorFunc("fail",err);
     console.log(response);
     res.send(response);
    }
   });
 }
 catch(e){
  let response = errorSet.errorFunc("fail",e);
  console.log(response);
  res.send(response);
 }
});
//-o_o===ValidateAddr===============================================|
app.post('/validate_address', async (req,res)=>{
 try{
  options.body.id='ValidateAddress';
  options.body.method='validateaddress';
  options.body.params = [];
  let address = req.body.address;
  options.body.params.push(address);

  await rp(options)
  .then((resp)=>{
   res.send(resp);
  })
  .catch((err)=>{
   if(err.cause){
    let response = errorSet.errorFunc('fail',err.cause);
    console.log(response);
    res.send(response);
   }
   if(err.error){
    let response = errorSet.errorFunc('fail',err.error.error.message);
    console.log(response);
    res.send(response);
   }
   else{
    let response = errorSet.errorFunc('fail',err);
    console.log(response);
    res.send(response);
   }
  });
 }
 catch(e){
  let response = errorSet.errorFunc('fail',e);
  console.log(response);
  res.send(response);
 }
});
//-o_o===TxDetail-local==============================================|
//Gets TxDetails for local addresses
app.post('/tx_detail_local', async (req,res)=>{
 try{
  let txid =req.body;
  console.log(txid);
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
    console.log(response);
    res.send(response);
   }
   else if(err.error){
    //console.log("errerrror",err.error);
    let response = errorSet.errorFunc("fail",err.error.error.message);
    console.log(response);
    res.send(response);
    }
   else{
    //console.log("generalerr", err);
    let response = errorSet.errorFunc("fail",err);
    console.log(response);
    res.send(response);
   }
  });
 }
 catch(e){
  let response = errorSet.errorFunc('fail', e);
  console.log(response);
  res.send(response);
 }
});
//-o_o===TxDetail-global=============================================|
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
    console.log(response);
    res.send(response);
   })
   .catch((err)=>{
    if(err.cause){
     //console.log("errcause",err.cause);
     let response = errorSet.errorFunc("fail",err.cause);
     console.log(response);
     res.send(response);
    }
    else if(err.error){
     //console.log("errerrror",err.error);
     let response = errorSet.errorFunc("fail",err.error.error.message);
     console.log(response);
     res.send(response);
    }
    else{
     //console.log("generalerr", err);
     let response = errorSet.errorFunc("fail",err);
     console.log(response);
     res.send(response);
    }
   })//after awaiting rp(options)
  })//after fetching rawtxid
  .catch((err)=>{
   if(err.cause){
    let response = errorSet.errorFunc("fail",err.cause);
    console.log(response);
    res.send(response);
   }
   else if(err.error){
    let response = errorSet.errorFunc("fail",err.error.error.message);
    console.log(response);
    res.send(response);
   }
   else{
    let response = errorSet.errorFunc("fail",err);
    console.log(response);
    res.send(response);
   }
  });
 }
 catch(e){
  let response = errorSet.errorFunc('fail', e);
  console.log(response);
  res.send(response);
 }
});
//-o_o===GetRawTx--=================================================|
function raw_tx(txid){
 return new Promise(async (resolve,reject)=>{
  try{
   options.body.method = 'getrawtransaction';
   options.body.params = [];
   options.body.params.push(txid);

   await rp(options)
   .then((resp)=>{
    let responso = errorSet.errorFunc('success',resp.result);
    resolve(responso.message);
   })
   .catch((err)=>{
    if(err.cause){
     let response = errorSet.errorFunc("fail",err.cause);
     console.log(response);
     reject(response);
    }
    if(err.error){
     let response = errorSet.errorFunc("fail",err.error.error.message);
     console.log(response);
     reject(response);
    }
    else{
     let response = errorSet.errorFunc("fail",err);
     console.log(response);
     reject(response);
    }
   });
  }
  catch(e){
   let response = errorSet.errorFunc('fail', e);
   console.log(response);
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
    console.log(response);
    res.send(response);
   }
   if(err.error){
    let response = errorSet.errorFunc('fail',err.error.error.message);
    console.log(response);
    res.send(response);
   }
   else{
    let response = errorSet.errorFunc('fail',err);
    console.log(response);
    res.send(response);
   }
  });
 }
 catch(e){
  let response = errorSet.errorFunc('fail',e);
  console.log(response);
  res.send(response);
 }
});
//-o_o===CONNECT===================================================|
app.listen(S_PORT,()=>
 console.log(`Node Server running on port ${S_PORT}`)
);
//-o_o===fin=======================================================|
