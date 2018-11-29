/*
Node Request 

Response from node contains:
{
result:
error:
}

Developed at ThroughBit Technologies Pvt. Ltd.
HYFERx Project
*/
//-<..>===========================================================~|
'use strict';
//-o_o===modules===================================================|
const bodyParser = require('body-parser');
const request = require ('request');
//-o_o===req=======================================================|
//req(options, endpoint_name for logs, response type)
let req = (options,ep_name)=>{
  return new Promise((resolve,reject)=>{  
    try{
      //console.log(`Options at node request:\n${JSON.stringify(options)}`);

      request(options,(error,response,body)=>{
        if(error){
          reject(error);
        }
        if(body===undefined){
          reject(body);
        }
        if(body.result!==null){
          //console.log(body);
          resolve(body.result);
        }
        else{
          reject(body.error);
        }
      });
      
    }
    catch(e){
      reject(`Error in request to ${ep_name}.\n${e}`);
    };
  });
}
//-o_o===exports===================================================|
module.exports={req};
//-o_o===fin=======================================================|
