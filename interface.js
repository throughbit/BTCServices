/*
Digibyte Node Interface

Developed at ThroughBit Technologies Pvt. Ltd.
HYFERx Project
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
const NI_PORT = process.env.NI_PORT;

let app = express();
app.use(helmet());
app.use(helmet.noCache());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

//-o_o===listunspent===================================================|
app.post('/get_utxo',(req,res)=>{
  try{
    //console.log(req.body.addresses.split(","));
    let _params = [2,999999,[]];
    _params[2].push(req.body.addresses);
    //console.log(JSON.stringify(_params));
    req_options.build("node",_params,"GetUtxo","listunspent")
    .then((options)=>{
      node_request.req(options,"/get_utxo")
      .then((resp)=>{
        res.send(res_fmt.create(true,resp));
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
        res.send(res_fmt.create(true,resp));
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
//-o_o===ValidateAddr==================================================|
app.post('/validate_address',(req,res)=>{
  try{
    req_options.build("node",[req.body.address],"ValidateAddress","validateaddress")
    .then((options)=>{
      node_request.req(options,"/validate_address")
      .then((resp)=>{
        res.send(res_fmt.create(true,resp));
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
      .then((resp)=>{
        res.send(res_fmt.create(true,resp));
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
      req_options.build("node",[hex],"TxDetailGlobal","decoderawtransaction")
      .then((options)=>{
        node_request.req(options,"/tx_detail_global")
        .then((resp)=>{
          res.send(res_fmt.create(true,resp));
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
let raw_tx = (txid) => {
  return new Promise((resolve,reject)=>{
    try{
      req_options.build("node",[txid],"GetRawTx","getrawtransaction")
      .then((options)=>{
        node_request.req(options,"raw_tx")
        .then((resp)=>{
          resolve(resp);
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
      .then((resp)=>{
        res.send(res_fmt.create(true,resp));
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
app.post('/import_address',(req,res)=>{
  try{
    req_options.build("node",[req.body.address],"ImportAddress","importaddress")
    .then((options)=>{
      console.log("Processing your request. This will take a few minutes.")
      node_request.req(options,"/import_address")
      .then((resp)=>{
        res.send(res_fmt.create(true,resp));
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
//-o_o===received_by_address=================================================|
app.post('/address_receives',(req,res)=>{
  try{
    req_options.build("node",[req.body.address],"ReceivedByAddress","getreceivedbyaddress")
    .then((options)=>{
      node_request.req(options,"/address_receives")
      .then((resp)=>{
        res.send(res_fmt.create(true,resp));
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
        res.send(res_fmt.create(true,resp));
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
//-o_o===create_multisig===============================================|
app.post('/create_multisig',(req,res)=>{
  try{
    let _params = [0,[]];
    _params[0] = parseInt(req.body.n);
    _params[1] = req.body.pubkeys.split(",");
    console.log(_params);
    req_options.build("node",_params,"CreateMultiSig","createmultisig")
    .then((options)=>{
      node_request.req(options,"/create_multisig")
      .then((resp)=>{
        res.send(res_fmt.create(true,resp));
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
app.post('/network_info',(req,res)=>{
  try{
    req_options.build("node",[],"GetFee","getnetworkinfo")
    .then((options)=>{
      node_request.req(options,"/network_info")
      .then((resp)=>{
        res.send(res_fmt.create(true,resp));
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
app.listen(NI_PORT,()=>
  console.log(`Node Server running on port ${NI_PORT}`)
);
//-o_o===fin===========================================================|
