/*
Receive Monitor

Developed at ThroughBit Technologies Pvt.Ltd
HYFERx Project

Updates:
MongoDb to store all recieves upto 10 confirmations
Currently assumes 1 address per txid
*/
//-o_O==========================================================~|
'use strict';
//-o_o===modules=================================================|
const res_fmt = require('./lib/response_format.js');
const slack = require('./lib/slack.js');
const logs = require('./lib/logs.js');
const req_options = require('./lib/options.js');
const errors = require('./lib/handle_errors.js');


const request = require('request');
const express = require('express');
const helmet = require('helmet');
const bodyParser = require('body-parser');

//-o_O===init===================================================~|
//Server created to respond to wallet_notify
const UPD_PORT = process.env.W_UPD;

let app = express();

app.use(helmet());
app.use(helmet.noCache());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

//Object sent as a notification.

//Object sent to NodeServer to parse tx
//-o_o===node-update==============================================|
//curled by wallet-notify
app.post('/node_update', (req,res)=>{
 try{
  //console.log(req.body.txid);
  tx_detail(req.body.txid)
  .then((data)=>{
   //console.log("Tx_details, fetched and parsed: \n",data.receives);
   //This is the parsed response that can be redirected to suite your application
   if(data.tx_details && data.tx_detail!==[]){
    let response = res_fmt.create(true,data);
    //console.log("here?",response);
    logs.receives(true, data);
    slack.update(JSON.stringify(data),'Receive Notifier');
    //notify orderbook
    res.send(response);
   }
   else {
    let response =  res_fmt.create(false, "TxId returns no details. Check your request!");
    console.log("Receives came back empty at /node_update",response);
    res.send(response);
   }
  })
  .catch((e)=>{
   res.send(errors.handle(e));
  });
 }
 catch(e){
  res.send(errors.handle(e));
 }
});
//-o_o===tx-detail================================================|
let tx_detail=(txid)=>{
  return new Promise((resolve,reject)=>{
    try{
      const tx_endpoint = `http://localhost:${process.env.NI_PORT}/tx_detail_local`;
      const _body = {"txid": txid};
      req_options.build(tx_endpoint,_body)
      .then((options)=>{
        request(options,(error, response, body)=>{
          if(error){
            reject(error);
          }
        //console.log(body);
          if(body.status){
            console.log(`Tx_detail request body:\n${body.message}`);
            tx_parse(body.message)
            .then(responso=>{
            //console.log("Responso back from tx_parse.\n",responso);
              resolve(responso);
            });
          }
          else { //tx_detail_local could send back a response that arrives as a body and carries an error
            reject(body);
          }
        });
      })
      .catch((e)=>{
        reject(e);
      });
    }
    catch(e){
      reject(e);
    }
  });
}
//-o_o===tx-parse================================================|
let tx_parse=(data)=>{
  return new Promise(async (resolve,reject)=>{
    try{
      let rec_set = {
        "txid":'',
        "confirmations":'',
        "tx_details":[]
      }
      rec_set.txid = data.txid;
      rec_set.confirmations = data.confirmations;
      console.log("The data to parse: ", data);
      rec_set.tx_details = data.details.map(async (obj)=>{
        //a single txid can contain multiple incoming transactions. map through it!
        if(obj.category==='receive'){ //remove this conditional to also notify about sends
        //console.log(obj.address);
          return ({"category": obj.category, "address":obj.address, "amount":obj.amount});
        //return (receives);
        }
      });

      await Promise.all(rec_set.tx_details)
      .then((details)=>{
        rec_set.tx_details = details;
      //console.log("receives formatted:",rec_set);
        resolve(rec_set);
      })
      .catch((e)=>{
        reject(e);
      });
    }
    catch(e){
      reject(e);
    }
  });
}
//-o_o===CONNECT===================================================|
app.listen(UPD_PORT,()=>
 console.log(`Wallet Update Server running on port ${UPD_PORT}`)
);
//-o_o===fin==================================================|
