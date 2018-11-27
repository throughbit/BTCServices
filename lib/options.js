/*
Request Options

Developed at ThroughBit Technologies Pvt. Ltd.
HYFERx Project
*/
//-<..>===========================================================~|
'use strict';
//-o_o===init======================================================|

//-o_o===build=====================================================|
let build = (destination,_params,_id,_method)=>{
  return new Promise((resolve,reject)=>{
    try{
      const NODE_PORT = process.env.NODE;
      const RPC_AUTH = process.env.RPC_AUTH;
      const nodeurl = `http://localhost:${NODE_PORT}`;
      
      let options = {
        method: 'POST',
        url: "",
        headers:
        {
        "Content-Type": 'application/json'
        },
        body: {},
        json: true
      };

      if(destination==='node'){
        options.headers.Authorization = `Basic ${RPC_AUTH}`;
        options.url = nodeurl;
        options.body.jsonrpc = '1.0';
        options.body.id = _id;
        options.body.method = _method;
        options.body.params = new Array();
        // _params.forEach((element)=>{
        //   options.body.params.push(element);
        // });
        options.body.params = _params;
      }
      
      else {
        options.url = destination;
        options.body = _params;
      }
      console.log(options);
      resolve(options); 
    }

    catch(e){
      console.log("Errored while creating options.",e);
      reject(e);
    }
  });
};
//-o_o===exports===================================================|
module.exports={build};
//-o_o===fin=======================================================|
