/*
Node Request 

Developed at ThroughBit Technologies Pvt. Ltd.
HYFERx Project
*/
//-<..>===========================================================~|
'use strict';
//-o_o===modules===================================================|
const res_fmt = require('./response_format.js');

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
          let respo = res_fmt.create(false,`Error in request to ${ep_name}.\n${error}`);
          reject(respo);
        }
        if(body===undefined){
          let respo = res_fmt.create(false,`Error in request to ${ep_name}.\n${body}`);
          reject(respo);
        }
        if(body.result!==null){
          console.log(body);
          let respo = res_fmt.create(true,body);
          resolve(respo);
        }
        if(body.result===null){
          let respo = res_fmt.create(false,`Error in request to ${ep_name}.\n${body.error}`);
          reject(respo);
        }
      });
      
    }
    catch(e){
      let respo = res_fmt.create(false,`Error in request to ${ep_name}.\n${e}`);
      reject(respo);
    };
  });
}
//-o_o===exports===================================================|
module.exports={req};
//-o_o===fin=======================================================|
