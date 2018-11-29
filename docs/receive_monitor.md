# receive_monitor.js

**Dependencies**

1*../lib/response_format.js
2*../lib/slack.js
3*../lib/logs.js
4*../lib/options.js
5*../lib/handle_errors.js

**Overview**

receive_monitor.js is used in conjunction with bitcoin.conf walletnotify, to notify about receives at the local node. 
It can also be adjusted to notify all sends from the local node: refer to line 119.

The server runs at `http://localhost:${process.env.W_UPD}/node_update` and takes {"txid":<txid>} as a request body.

This txid is passed to this endpoint by a shell-script that is called by wallet-notify and passed a txid as follows:

walletnotify=/home/path/to/rec_check.bash %s 

For every receive rec_check.bash is executed and %s passes the txid as an argument.

rec_check.bash contains the following:
#!/bin/bash

curl -X POST "http://localhost:$W_UPD/node_update" -d "txid=$1"

The response follows the following format: 
{
  "txid":'',
  "confirmations":'',
  "tx_details":[]
}
tx_details is an array of objects which contains the following fields:
{
  category: send/receive,
  address: address_involved,
  amount: in_btc
}
*Note that a single txid can contain multiple transactions.
