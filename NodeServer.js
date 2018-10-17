/*
Node Server
Developed at ThroughBit Technologies Pvt. Ltd.
HYFERx Project
Requires:
-Input checks:
-Review of error handling
-Review of aync behaviour

Responses Format from node:
{
"result":
"error":
"id":
}

#todo:
=when catching err from await rp().then.catch() final filter attempt sends raw err;
-this can be improved to be more specific

*/
//-<..>===========================================================~|
'use strict';
//-o_o===modules===================================================|
const errorSet = require('./errors.js');

const express = require('express');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const rp = require ('request-promise-native');
//-o_o===init======================================================|
const S_PORT = process.env.SERV;
const NODE_PORT = process.env.NODE;
const RPC_AUTH = process.env.RPC_AUTH;
const nodeurl = `http://localhost:${NODE_PORT}`;

var app = express();
app.use(helmet());
app.use(helmet.noCache());
app.use(bodyParser.json());
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
  options.body.params.push(2);
  options.body.params.push(999999);
  let addresses = req.body.addresses;
  options.body.params.push(addresses);

  await rp(options)
   .then((resp)=>{
    if(resp.error==null){
    let response = errorSet.errorFunc("success","Check Array", resp.result);
    console.log("Success at /get_utxo\n",response);
    res.send(response);
    }
    else{
    console.log("Error response from get_utxo.\nHere is the entire response:\n",resp)
    let response = errorSet.errorFunc("fail",resp.error);
    res.send(response);
    }
   })
   .catch((err)=>{
    if(err.cause){
     if(err.cause.code==="ECONNREFUSED"){
      //slack notify?
      let response = errorSet.errorFunc("fail","Error: Daemon not running.");
      console.log("Caught at /get_utxo\n", response);
      res.send(response);//does res.status(500) send response back under error?
     }
     let response = errorSet.errorFunc("fail",err.cause);
     console.log("Err with cause at /get_utxo\n",response);
     res.send(response);
    }

//     if(err.error){
//      let response = errorSet.errorFunc("fail",err.error);
//      console.log(response);
//      res.send(response);
//     }
    else{
     let response = errorSet.errorFunc("fail",err.error.error.message);
     console.log("Err at /get_utxo\n",response);
     res.send(response);
    }
   });
 }
 catch(e){
  let response = errorSet.errorFunc("fail",e);
  console.log("Failed at /get_utxo, final catch\n", response);
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
    if(resp.error==null){
     let response = errorSet.errorFunc("success",resp.result);
     console.log("Success at /new_address\n",response);
     res.send(response);
    }
    else{
     let response = errorSet.errorFunc("fail", resp.result);
     console.log("Fail at /new_address\n",response);
     res.send(response);
    }
   })
   .catch((err)=>{
    if(err.cause){
     if(err.cause.code==="ECONNREFUSED"){
      let response = errorSet.errorFunc("fail","Error: Daemon not running.");
      console.log("Caught at /new_address\n", response);
      res.send(response);//does res.status(500) send response back under error?
     }
     let response = errorSet.errorFunc("fail",err);
     console.log("Failed at /new_address with .cause \n",err);
     res.send(response);
    }
//     if(err.error){
//      let response = errorSet.errorFunc("fail",err.error.error.message);
//      console.log(response);
//      res.send(response);
//     }
    else{
     let response = errorSet.errorFunc("fail",err.error.error.message);
     console.log("Failed at /new_address\n",response);
     res.send(response);
    }
   });
 }
 catch(e){
  let response = errorSet.errorFunc("fail",e);
  console.log("Failed at /new_address, final catch\n",response);
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
   let response = errorSet.errorFunc('success',resp.result);
   console.log("Success at /validate_address\n",response);
   res.send(response);
  })
  .catch((err)=>{
   if(err.cause){
    if(err.cause.code==="ECONNREFUSED"){
     let response = errorSet.errorFunc("fail","Error: Daemon not running.");
     console.log("Caught at /validate\n", response);
     res.send(response);//does res.status(500) send response back under error?
    }
    let response = errorSet.errorFunc('fail',err.cause);
    console.log("Failed at /validate_address with .cause\n",response);
    res.send(response);
   }
//    if(err.error){
//     let response = errorSet.errorFunc('fail',err.error.error.message);
//     console.log(response);
//     res.send(response);
//    }
   else{
    let response = errorSet.errorFunc('fail',err.error.error.message);
    console.log("Failed at /validate_address\n",response);
    res.send(response);
   }
  });
 }
 catch(e){
  let response = errorSet.errorFunc('fail',e);
  console.log("Failed at /validate_address, final catch\n",response);
  res.send(response);
 }
});
//-o_o===TxDetail-local==============================================|
//Gets TxDetails for local addresses
app.post('/tx_detail_local', async (req,res)=>{
 try{
  let txid =req.body.txid;
  options.body.id = 'TxDetailLocal';
  options.body.method = 'gettransaction';
  options.body.params = [];
  options.body.params.push(txid);

  await rp(options)
  .then((resp)=>{
   let response = errorSet.errorFunc('success',resp.result);
   console.log("Success from /tx_detail_local\n",response);
   res.send(response);
  })
  .catch((err)=>{
   if(err.cause){
    //console.log("errcause",err.cause);
    if(err.cause.code==="ECONNREFUSED"){
     let response = errorSet.errorFunc("fail","Error: Daemon not running.");
     console.log("Caught at /tx_detail_local\n", response);
     res.send(response);//does res.status(500) send response back under error?
    }
    let response = errorSet.errorFunc("fail",err.cause);
    console.log("Fail at /tx_detail_local with .cause\n",response);
    res.send(response);
   }
   // else if(err.error){
   //  //console.log("errerrror",err.error);
   //  let response = errorSet.errorFunc("fail",err.error.error.message);
   //  console.log("Fail at /tx_detail_local",response);
   //  res.send(response);
   //  }
   else{
    //console.log("generalerr", err);
    let response = errorSet.errorFunc("fail",err.error.error.message);
    console.log("Fail at /tx_detail_local\n",response);
    res.send(response);
   }
  });
 }//closingtry
 catch(e){
  let response = errorSet.errorFunc('fail', e);
  console.log("Fail at /tx_detail_local, final catch\n",response);
  res.send(response);
 }
});
//-o_o===TxDetail-global=============================================|
app.post('/tx_detail_global', async (req,res)=>{
//Gets TxDetails for any transaction on the network
 try{
  let txid =req.body.txid;

  raw_tx(txid)
  .then(async (hex)=>{

   options.body.id = 'TxDetailGlobal';
   options.body.method = 'decoderawtransaction';
   options.body.params = [];
   options.body.params.push(hex.message);

   await rp(options)
   .then((resp)=>{
    let response = errorSet.errorFunc('success',"Check Object",[],resp.result);
    console.log("TX_DETAIL_GLOBAL BABY! WORLDWIDE!!!:",JSON.stringify(resp.result,null,1));
    console.log("Success at /tx_detail_global\n",response);
    res.send(response);
   })
   .catch((err)=>{
    if(err.cause){
     if(err.cause.code==="ECONNREFUSED"){
      let response = errorSet.errorFunc("fail","Error: Daemon not running.");
      console.log("Caught at /tx_detail_global\n", response);
      res.send(response);//does res.status(500) send response back under error?
     }
     //console.log("errcause",err.cause);
     let response = errorSet.errorFunc("fail",err.cause);
     console.log("Fail at /tx_detail_global within call to decode_tx; with .cause\n",response);
     res.send(response);
    }
//      else if(err.error){
//       //console.log("errerrror",err.error);
//       let response = errorSet.errorFunc("fail",err.error.error.message);
//       console.log(response);
//       res.send(response);
//      }
    else{
     //console.log("generalerr", err);
     let response = errorSet.errorFunc("fail",err.error.error.message);
     console.log("Fail at /tx_detail_global within call to decode_tx.\n",response);
     res.send(response);
    }
   })//after awaiting rp(options)
  })//after fetching rawtxid
  .catch((err)=>{
    let response = errorSet.errorFunc("fail",err.message);
    console.log("Fail at /tx_detail_global within call to raw_tx() \n",response);
    res.send(response);
   });
 }
 catch(e){
  let response = errorSet.errorFunc('fail', e);
  console.log("Fail at /tx_detail_global, final catch\n",response);
  res.send(response);
 }
});
//-o_o===GetRawTx--=================================================|
function raw_tx(txid){
 return new Promise(async (resolve,reject)=>{
  try{
   options.body.id = 'GetRawTx';
   options.body.method = 'getrawtransaction';
   options.body.params = [];
   options.body.params.push(txid);

   await rp(options)
   .then((resp)=>{
    let response = errorSet.errorFunc('success',resp.result);
    console.log("Success at raw_tx()\n",response);
    resolve(response);
   })
   .catch((err)=>{
    if(err.cause){
     if(err.cause.code==="ECONNREFUSED"){
      let response = errorSet.errorFunc("fail","Error: Daemon not running.");
      console.log("Caught at raw_tx()\n", response);
      reject(response);//does res.status(500) send response back under error?
     }
     else{
     let response = errorSet.errorFunc("fail",err.cause);
     console.log("Fail at raw_tx(), with .cause\n",response);
     reject(response);
    }
    }
//     if(err.error){
//      let response = errorSet.errorFunc("fail",err.error.error.message);
//      console.log("Fail at raw_txid()",response);
//      reject(response);
//     }
    else{
     let response = errorSet.errorFunc("fail",err.error.error.message);
     console.log("Fail at raw_txid()\n",response);
     reject(response);
    }
   });
  }
  catch(e){
   let response = errorSet.errorFunc('fail',e,[], e);
   console.log("Fail at raw_tx(), final catch\n",response);
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
   let response = errorSet.errorFunc("success", resp.result);
   console.log("Success at /broadcastx\n",response);
   res.send(response);
  })
  .catch((err)=>{
   if(err.cause){
    if(err.cause.code==="ECONNREFUSED"){
     let response = errorSet.errorFunc("fail","Error: Daemon not running.");
     console.log("Caught at /broadcastx\n", response);
     res.send(response);//does res.status(500) send response back under error?
    }
    else{
    let response = errorSet.errorFunc('fail',err.cause);
    console.log("Fail at /broadcastx, with .cause\n",response);
    res.send(response);
   }
   }
//    if(err.error){
//     let response = errorSet.errorFunc('fail',err.error.error.message);
//     console.log("Fail at /broadcastx",response);
//     res.send(response);
//    }
   else{
    let response = errorSet.errorFunc('fail',err.error.error.message);
    console.log("Fail at /broadcastx\n",response);
    res.send(response);
   }
  });
 }
 catch(e){
  let response = errorSet.errorFunc('fail',e);
  console.log("Fail at /broadcastx, final catch\n",response);
  res.send(response);
 }
});
//-o_o===ImportAddress=================================================|
app.post('/import_address', async (req,res)=>{
 try{
  options.body.id='ImportAddress';
  options.body.method='importaddress';
  options.body.params = [];
  options.body.params.push(req.body.address);
  console.log("Processing your request. This will take a few minutes.")
  await rp(options)
  .then((resp)=>{
   let response = errorSet.errorFunc("success", `${options.body.params} is imported to your node.`);
   console.log("Success at /import_address.\n",response);
   res.send(response);
  })
  .catch((err)=>{
   if(err.cause){
    if(err.cause.code==="ECONNREFUSED"){
     let response = errorSet.errorFunc("fail","Error: Daemon not running.");
     console.log("Caught at /import_address\n", response);
     res.send(response);//does res.status(500) send response back under error?
    }
    else{
    let response = errorSet.errorFunc('fail',err.cause);
    console.log("Fail at /import_address, with .cause\n",response);
    res.send(response);
   }
   }
//    if(err.error){
//     let response = errorSet.errorFunc('fail',err.error.error.message);
//     console.log("Fail at /import_address",response);
//     res.send(response);
//    }
   else{
    let response = errorSet.errorFunc('fail',err.error.error.message);
    console.log("Fail at /import_address\n",response);
    res.send(response);
   }
  });
 }
 catch(e){
  let response = errorSet.errorFunc('fail',e);
  console.log("Fail at /import_address, final catch\n",response);
  res.send(response);
 }
});
//-o_o===CONNECT===================================================|
app.listen(S_PORT,()=>
 console.log(`Node Server running on port ${S_PORT}`)
);
//-o_o===fin=======================================================|
