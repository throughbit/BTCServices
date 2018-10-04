/*
HYFERx Project
Digibyte node server
*/
//-o_O============================================================~|
'use strict';
//-o_o===modules===================================================|
//const digibyte = require('digibyte');
var errorSet = require('./errors.js');
var express = require('express');
var helmet = require('helmet');
var bodyParser = require('body-parser');
var rp = require ('request-promise-native');
//-o_o===init======================================================|
const S_PORT = process.env.SERV;
const NODE_PORT = process.env.NODE;
const RPC_AUTH = process.env.RPC_AUTH;
const digiurl = `http://localhost:${NODE_PORT}`;
var app = express();

app.use(helmet());
app.use(helmet.noCache());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}));

var addresses = ["DJ6FfMCxdUC6vAYvN9yJNd5Quok8AYW9PR"];

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
  options.body.params = [6,99999,addresses];
  console.log(JSON.stringify(options));
  await rp(options)
   .then((resp)=>{
    console.log(resp.result);
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
   console.log(response);
   res.send(response);
 }
});
//-o_o===AddressGen================================================|
app.post('/new_address', async (req,res)=>{
 try{
  options.body.id = 'NewAddress';
  options.body.method = 'getnewaddress';
  options.body.params = [];
console.log(options);
  await rp(options)
   .then((resp)=>{
    //console.log(resp.result);
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
   console.log(response);
   res.send(response);
 }
});
//-o_o===TxDetail==================================================|
app.post('/tx_detail', async (req,res)=>{
 try{
  raw_tx(req.body.txid)
  .then(async (hex)=>{
   options.body.method = 'decoderawtransaction';
   options.body.params = [];
   options.body.params.push(hex);
   await rp(options)
   .then((resp)=>{
    console.log("RESPRESULT:",resp.result);
    let response = errorSet.errorFunc('success',resp.result);
    console.log("RESPONSE",response);
     res.send(response);
    })
   .catch((err)=>{
   if(err.cause){
console.log("errcause",err.cause);
    let response = errorSet.errorFunc("fail",err.cause);
    res.send(response);
   }
   else if(err.error){
console.log("errerrror",err.error);
    let response = errorSet.errorFunc("fail",err.error.error.message);
    res.send(response);
   }
   else{
console.log("generalerr", err);
    let response = errorSet.errorFunc("fail",err);
    res.send(response);
   }
  })})
  .catch((err)=>{
   if(err.cause){
console.log("errcause2",err.cause);
    let response = errorSet.errorFunc("fail",err.cause);
    res.send(response);
   }
   else if(err.error){
console.log("errerrror2",err.error);
    let response = errorSet.errorFunc("fail",err.error.error.message);
    res.send(response);
   }
   else{
console.log("generalerr2", err);
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
//-o_o===RawTx--=================================================+=|
function raw_tx(txid){
 return new Promise(async (resolve,reject)=>{
  try{
    options.body.method = 'getrawtransaction';
    options.body.params = [];
    options.body.params.push(txid);
    await rp(options)
    .then((resp)=>{
      console.log("RESPRESULT",resp.result);
     let response = errorSet.errorFunc('success',resp.result);
      console.log("RESPONSE", response);
     resolve(response.message);
    }).catch((err)=>{
     if(err.cause){
console.log("errcause", err.cause);
      let response = errorSet.errorFunc("fail",err.cause);
      reject(response);
     }
     if(err.error){
console.log("errerror3", err.error);
      let response = errorSet.errorFunc("fail",err.error.error.message);
      reject(response);
     }
     else{
 console.log("generalerr3", err);
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

  console.log(options);
  await rp(options)
   .then((resp)=>{
    console.log(resp);
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
   console.log(response);
   res.send(response);
 }
});
//-o_o===CONNECT===================================================|
app.listen(S_PORT,()=>
 console.log(`Node Server running on port ${S_PORT}`)
);
//-o_o===fin=======================================================|
