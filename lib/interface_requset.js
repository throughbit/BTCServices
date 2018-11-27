/*
Interface Request 

Developed at ThroughBit Technologies Pvt. Ltd.
HYFERx Project
*/
//-<..>===========================================================~|
'use strict';
//-o_o===modules===================================================|
const res_fmt = require('./response_format.js');
const req_options = require('./options.js');
const errors = require('./handle_errors.js');

const bodyParser = require('body-parser');
const request = require ('request');
//-o_o===init======================================================|
const ep = {
  main:`http://localhost:${process.env.NI_PORT}`,
  addr:"/new_address",
  utxo:"/get_utxo",
  val_add:"/validate_address",
  tx_l:"/tx_detail_local",
  tx_g:"/tx_detail_global",
  bc:"/broadcastx",
  imp_a:"/import_address",
  msig:"/create_multisig"
};
//-o_o===req=======================================================|
let req_address = ()=>{
  return new Promise((resolve,reject)=>{  
    try{
      const _ep = `${ep.main}${ep.addr}`;
      const _body = {};
      req_options.build(_ep,_body)
      .then((options)=>{
        request(options, (error,response,body)=>{
          if(error){
            reject(errors.handle(error));
          }
        console.log(body);
          if(body.status){
            let responso  = res_fmt.create("true", body)
            resolve(responso);
          }
        });
      })
      .catch((e)=>{
        reject(errors.handle(e));
      });
    }
    catch(e){
      reject(errors.handle(e));
    };
  });
}
//-o_o===req=======================================================|
let req_tx_local = (txid)=>{
  return new Promise((resolve,reject)=>{  
    try{
      const _ep = `${ep.main}${ep.tx_l}`;
      const _body = {"txid": txid};
      req_options.build(_ep,_body)
      .then((options)=>{
        request(options, (error,response,body)=>{
          if(error){
            reject(errors.handle(error));
          }
        console.log(body);
          if(body.status){
            let responso  = res_fmt.create("true", body)
            resolve(responso);
          }
        });
      })
      .catch((e)=>{
        reject(errors.handle(e));
      });
    }
    catch(e){
      reject(errors.handle(e));
    };
  });
}
//-o_o===exports===================================================|
module.exports={req_address,req_tx_local};
//-o_o===fin=======================================================|
