/*
Developed at ThroughBit Technologies Pvt.Ltd
HYFERx Project
Tx Parser: used in conjunction with wallet-notify
*/
//-o_O==========================================================~|
'use strict';
//-o_o===modules=================================================|
const res_fmt = require('./response_format.js');
const slack = require('./slack.js');
const logs = require('./logs.js');
const req_options = require('./options.js');
const errors = require('./handle_errors.js');

const request = require('request');
const express = require('express');
const helmet = require('helmet');
const bodyParser = require('body-parser');
//-o_O===init===================================================~|
//Server created to respond to wallet_notify
const UPD_PORT = process.env.W_UPD;
//NodeServer: called to aquire tx_detail

//Path to log file

var app = express();

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
   if(data.tx_details){
    let response = res_fmt.write(true,data);
    //console.log("here?",response);
    logs.receives(true, data);
    slack.update_slack(JSON.stringify(data),'Receive Notifier');
    //notify orderbook
    res.send(response);
   }
   else {
    let response =  res_fmt.write(false, "Txid Has no wallet receives.");
    console.log("Receives came back  empty at  /node-update",response);
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
function tx_detail(txid){
  return new Promise((resolve,reject)=>{
    try{
      const server_url = `http://localhost://${process.env.SERV}`;
      req_options.build(`${server_url}/tx_detail_local`,txid)
      .then((options)=>{
        request(options,(error, response, body)=>{
          if(error){
            reject(error);
          }
        //console.log(body);
          if(body.status){
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
function tx_parse(data){
  return new Promise(async (resolve,reject)=>{
    try{
      var rec_set = {
        "txid":'',
        "confirmations":'',
        "tx_details":[]
      }
      rec_set.txid = data.txid;
      rec_set.confirmations = data.confirmations;
      console.log("The data to parse: ", data.details);
      rec_set.tx_details = data.details.map(async function(obj){
      //if(obj.category==='receive'){ //remove this to also notify about sends
      //console.log(obj.address);
        return ({"category": obj.category, "address":obj.address, "amount":obj.amount});
      //return (receives);
      //}
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
