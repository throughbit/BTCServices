/*
Node Server
Developed at ThroughBit Technologies Pvt. Ltd.
HYFERx Project
Requires:
-Input checks:
-Review of error handling
*/
//-<..>===============================================================~|
'use strict';
//-o_o===modules=======================================================|
const res_fmt = require('./lib/response_format.js');
const req_options = require('./lib/options.js');
const node_request = require('./lib/node_request.js');
const errors = require('./lib/handle_errors.js');

const express = require('express');
const helmet = require('helmet');
const bodyParser = require('body-parser');
//-o_o===init==========================================================|
const S_PORT = process.env.SERV;

var app = express();
app.use(helmet());
app.use(helmet.noCache());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

//-o_o===listunspent===================================================|
app.post('/get_utxo',(req,res)=>{
  try{
    console.log(req.body.addresses.split(","));
    let _params = [2,999999,[]];
    _params[2] = req.body.addresses.split(",");
    //console.log(_params);
    req_options.build("node",_params,"GetUtxo","listunspent")
    .then((options)=>{
     // console.log(options);
      node_request.req(options,"/get_utxo")
      .then(resp=>{
        let response = res_fmt.create(true,resp.message);
       // console.log("Successful response from /get_utxo node_request", response);
        res.send(response);
      })
      .catch((e)=>{
        res.send(errors.handle(e));
      });
    })
    .catch((e)=>{
      res.send(errors.handle(e));
    });
  }
  catch(e){
    res.send(errors.handle(e));
  }
});
//-o_o===getnewaddress=================================================|
app.post('/new_address',(req,res)=>{
  try{
    req_options.build("node",[],"NewAddress","getnewaddress")
    .then((options)=>{
      node_request.req(options,"/new_address")
      .then((resp)=>{
        let response = res_fmt.create("success",resp.message);
        //console.log("Successful response from /new_address node_request");
        res.send(response);
      })//established that every promise requires a catch
      .catch((e)=>{
        res.send(errors.handle(e));
      });
    })
    .catch((e)=>{
      res.send(errors.handle(e));
    });
  }
  catch(e){
    res.send(errors.handle(e));
  }
});
//-o_o===ValidateAddr==================================================|
app.post('/validate_address',(req,res)=>{
  try{
    req_options.build("node",[req.body.address],"ValidateAddress","validateaddress")
    .then((options)=>{
      node_request.req(options,"/validate_address")
      .then(resp=>{
        let response = res_fmt.create("success",resp.message);
        //console.log("Successful response from /validate_address node_request");
        res.send(response);
      })
      .catch((e)=>{
        res.send(errors.handle(e));
      });
    })
    .catch((e)=>{
      res.send(errors.handle(e));
    });
  }
  catch(e){
    res.send(errors.handle(e));
  }
});
//-o_o===TxDetail-local================================================|
//Gets TxDetails for local addresses
app.post('/tx_detail_local',(req,res)=>{
  try{
    req_options.build("node",[req.body.txid],"TxDetailLocal",'gettransaction')
    .then((options)=>{
      node_request.req(options,"/tx_detail_local")
      .then(resp=>{
        let response = res_fmt.create("success",resp.message);
        //console.log("Successful response from /tx_detail_local node_request");
        res.send(response);
      })
      .catch((e)=>{
        res.send(errors.handle(e));
      });
    })
    .catch((e)=>{
      res.send(errors.handle(e));
    });
  }//closingtry
  catch(e){
    res.send(errors.handle(e));
  }
});
//-o_o===TxDetail-global===============================================|
app.post('/tx_detail_global',(req,res)=>{
//Gets TxDetails for any transaction on the network
  try{
    let txid =req.body.txid;
    raw_tx(txid)
    .then((hex)=>{
      req_options.build("node",[hex.message],"TxDetailGlobal","decoderawtransaction")
      .then((options)=>{
        node_request.req(options,"/tx_detail_global")
        .then((resp)=>{
          let response = res_fmt.create("success",resp.message);
          //console.log("Successful response from /tx_detail_global node_request");
          res.send(response);
        })
        .catch((e)=>{
          res.send(errors.handle(e));
        });
      })
      .catch((e)=>{
        res.send(errors.handle(e));
      });
    })
    .catch((e)=>{
      res.send(errors.handle(e));
    });
  }//closingtry
  catch(e){
    res.send(errors.handle(e));
  }
});
//-o_o===GetRawTx--====================================================|
function raw_tx(txid){
  return new Promise((resolve,reject)=>{
    try{
      req_options.build("node",[txid],"GetRawTx","getrawtransaction")
      .then((options)=>{
        node_request.req(options,"raw_tx")
        .then(resp=>{
          let response = res_fmt.create("success",resp.message);
          //console.log("Successful response from raw_tx node_request");
          resolve(response);
        })
        .catch((e)=>{
          res.send(errors.handle(e));
        });
      })
      .catch((e)=>{
        res.send(errors.handle(e));
      });
    }//closingtry
    catch(e){
      res.send(errors.handle(e));
    }
  });  
}
//-o_o===Broadcast=====================================================|
app.post('/broadcastx',(req,res)=>{
  try{
    req_options.build("node",[req.body.hex],"BroadcastTx","sendrawtransaction")
    .then((options)=>{
      node_request.req(options,"/broadcastx")
      .then(resp=>{
        let response = res_fmt.create("success",resp.message);
        //console.log("Successful response from /broadcastx node_request");
        res.send(response);
      })
      .catch((e)=>{
        res.send(errors.handle(e));
      });
    })
    .catch((e)=>{
      res.send(errors.handle(e));
    });
  }//closingtry
  catch(e){
    res.send(errors.handle(e));
  }
});
//-o_o===ImportAddress=================================================|
app.post('/import_address', async (req,res)=>{
  try{
    req_options.build("node",[req.body.address],"ImportAddress","importaddress")
    .then((options)=>{
      console.log("Processing your request. This will take a few minutes.")
      node_request.req(options,"/import_address")
      .then(resp=>{
        let response = res_fmt.create("success",resp.message);
        //console.log("Successful response from /import_address node_request");
        res.send(response);
      })
      .catch((e)=>{
        res.send(errors.handle(e));
      });
    })
    .catch((e)=>{
      res.send(errors.handle(e));
    });
  }//closingtry
  catch(e){
    res.send(errors.handle(e));
  }
});
//-o_o===getnewaddress=================================================|
app.post('/get_balance',(req,res)=>{
  try{
    req_options.build("node",[],"GetBalance","getbalance")
    .then((options)=>{
      node_request.req(options,"/get_balance")
      .then((resp)=>{
        let response = res_fmt.create("success",resp.message);
        //console.log("Successful response from /get_balance node_request");
        res.send(response);
      })
      .catch((e)=>{
        res.send(errors.handle(e));
      });
    })
    .catch((e)=>{
      res.send(errors.handle(e));
    });
  }
  catch(e){
    res.send(errors.handle(e));
  }
});
//-o_o===listunspent===================================================|
app.post('/create_multisig',(req,res)=>{
  try{
    console.log(req.body.n)
    let _params = [0,[]];
    _params[0] = parseInt(req.body.n);
    _params[1] = req.body.pubkeys.split(",");
    console.log(_params);
    req_options.build("node",_params,"CreateMultiSig","createmultisig")
    .then((options)=>{
     // console.log(options);
      node_request.req(options,"/create_multisig")
      .then(resp=>{
        let response = res_fmt.create(true,resp.message);
       // console.log("Successful response from /get_utxo node_request", response);
        res.send(response);
      })
      .catch((e)=>{
        res.send(errors.handle(e));
      });
    })
    .catch((e)=>{
      res.send(errors.handle(e));
    });
  }
  catch(e){
    res.send(errors.handle(e));
  }
});
//-o_o===CONNECT=======================================================|
app.listen(S_PORT,()=>
  console.log(`Node Server running on port ${S_PORT}`)
);
//-o_o===fin===========================================================|
