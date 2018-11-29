/*
Error Handlers

Developed at ThroughBit Technologies Pvt.Ltd
HYFERx Project
*/
//-o_O==========================================================~|
'use strict';
//-o_o===modules=======================================================|
const res_fmt = require('./response_format.js');
const slack = require('./slack.js');
//-o_O===f(x)===================================================~|
let handle=(e)=>{  
    if(e.cause){
      if(e.cause.code==="ECONNREFUSED"){
        slack.update("Daemon not running.","Node-Error");
        let response = res_fmt.create(false,'Daemon not running');
        console.log(response);
        return response;//does res.status(500) send response back under error?
      }
      else{
        let response = res_fmt.create(false,e.cause);
        console.log(response);
        return response;
      }
    }
    else if (e.error){
      if (e.error.error){
        let response = res_fmt.create(false,e.error.error.message);
        console.log(response);
        return response;
      }
      else{
        let response = res_fmt.create(false,e.error);
        console.log(response);
        return response;
      }
    }
    else{
      let response = res_fmt.create(false,e);
      console.log(response);
      return response;
    }

}
//-o_O===Exports================================================~|
module.exports = {handle};
//-o_O===fin====================================================~|