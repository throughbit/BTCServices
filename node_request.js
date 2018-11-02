/*
Node Request 
Developed at ThroughBit Technologies Pvt. Ltd.
HYFERx Project


Responses Format from node:
{
"result":
"error":
"id":
}
*/
//-<..>===========================================================~|
'use strict';
//-o_o===modules===================================================|
const res_fmt = require('./response_format.js');

const bodyParser = require('body-parser');
const rp = require ('request-promise-native');
//-o_o===req=======================================================|
//req(options, endpoint_name for logs, response type)
function req (options,ep_name){
  return new Promise((resolve,reject)=>{  
    try{
      rp(options)
      .then((resp)=>{
        if(resp.error===null){ 
              let response = res_fmt.create(true,resp.result);
              //console.log(`Success at ${ep_name}\n`,resp);
              resolve(response);
        }
        else{
          console.log(`Error response from ${ep_name}.\nHere is the entire response:\n`,resp)
          reject(resp.error);
        }
      })
      .catch((e)=>{
        reject(e);
      });
    }
    catch(e){
      reject(e);
    };
  });
}
//-o_o===exports===================================================|
module.exports={req};
//-o_o===fin=======================================================|
