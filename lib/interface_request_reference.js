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
  n_i:`http://localhost:${process.env.NI_PORT}`,
  send:`http://localhost:${process.env.L_PORT}`,
  addr:"/new_address",
  utxo:"/get_utxo", //requires{addresses:<single address>}
  val_add:"/validate_address", //requires {address:<address>}
  tx_l:"/tx_detail_local", //requires {txid:<txid_for_local_address>}
  tx_g:"/tx_detail_global",// requires{txid:<any txid>}
  bc:"/broadcastx",//requires{hex:<signed tx-hex>}
  imp_a:"/import_address",//requires{address:<address to import to wallet>}
  msig:"/create_multisig",//requires{n:<number of signatories>, pubkeys:<comma separated pubkeys>}
  add_recs:"/address_receives" //requires {address:<address>}
};
//-o_o===req=======================================================|
let req_address = ()=>{
  return new Promise((resolve,reject)=>{
    try{
      const _ep = `${ep.n_i}${ep.addr}`;
      const _body = {};
      req_options.build(_ep,_body)
      .then((options)=>{
        request(options, (error,response,body)=>{
          if(error){
            reject(error);
          }
        //console.log(body);
          if(body.status){
            resolve(body.message);
          }
          else{
            reject(body.message);
          }
        });
      })
      .catch((e)=>{
        reject(`Error creating options: ${e}`);
      });
    }
    catch(e){
      reject(`Error in making requst to interface: ${e}`);
    };
  });
}
//-o_o===req=======================================================|
let req_tx_local = (txid)=>{
  return new Promise((resolve,reject)=>{
    try{
      const _ep = `${ep.n_i}${ep.tx_l}`;
      const _body = {"txid": txid};
      req_options.build(_ep,_body)
      .then((options)=>{
        request(options, (error,response,body)=>{
          if(error){
            reject(error);
          }
        //console.log(body);
          if(body.status){
            resolve(body.message);
          }
          else{
            reject(body.message);
          }
        });
      })
      .catch((e)=>{
        reject(`Error creating options: ${e}`);
      });
    }
    catch(e){
      reject(`Error in making requst to interface: ${e}`);
    };
  });
}
//-o_o===req=======================================================|
let req_send = (send_orders)=>{
  return new Promise((resolve,reject)=>{
    try{
      const send_orders = [
        {
          "address": "DBDAhnDHhs1qRdW2tURnc95JrAy5eK5WbW",
          "amount":5000,
          "orderId":"TBDGB-9J298IJQ1231222113"
        },
        {
          "address": "DBDAhnDHhs1qRdW2tURnc95JrAy5eK5WbW",
          "amount":5000,
          "orderId":"TBDGB-95T698IJQ123762352"
        },
        {
          "address": "DBDAhnDHhs1qRdW2tURnc95JrAy5eK5WbW",
          "amount":5000,
          "orderId":"TBDGB-9KL98IJQ123621113213"
        }
        ];
      const _ep = `${ep.send}`;
      const _body = {"send_orders":send_orders};
      req_options.build(_ep,_body)
      .then((options)=>{
        request(options, (error,response,body)=>{
          if(error){
            reject(error);
          }
        //console.log(body);
          if(body.status){
            resolve(body.message);
          }
          else{
            reject(body.message);
          }
        });
      })
      .catch((e)=>{
        reject(`Error creating options: ${e}`);
      });
    }
    catch(e){
      reject(`Error in making requst to send-server: ${e}`);
    };
  });
}
//-o_o===exports===================================================|
module.exports={req_address,req_tx_local,req_send};
//-o_o===fin=======================================================|
