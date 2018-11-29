# receive_monitor.js

## Dependencies

* response_format.js as res_fmt
* slack.js as slack
* logs.js as logs
* options.js as req_options
* handle_errors.js as errors

## Overview

receive_monitor.js is used in conjunction with bitcoin.conf **walletnotify**, to notify about receives at the local node.
It can also be adjusted to notify all sends from the local node:
(lines 118-119)

        rec_set.tx_details = data.details.map(async function(obj){
        if(obj.category==='receive'){ //remove this conditional to also notify about sends

The server runs at:

`http://localhost:${process.env.W_UPD}/node_update`;  and takes {"txid":<txid>} as a request body.

A txid is passed to this endpoint by a shell-script that is called by wallet-notify:
(digibyte.conf)

        walletnotify=/home/path/to/rec_check.bash %s

For every receive rec_check.bash is executed and %s passes the txid as an argument.
(rec_check.bash)

        #!/bin/bash
        curl -X POST "http://localhost:$W_UPD/node_update" -d "txid=$1"

The response follows the following format:

        let rec_set = {
          "txid":'',
          "confirmations":'',
          "tx_details":[]
        }

tx_details is an array of objects which contains the following fields:
(lines 118-123)

        rec_set.tx_details = data.details.map(async (obj)=>{
          //a single txid can contain multiple incoming transactions. map through it!
          ...
          return ({"category": obj.category, "address":obj.address, "amount":obj.amount});
        }
