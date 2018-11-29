# Node Services
Be your own bank!

A basic node interface for BTC forked crypto-networks like DGB, VTC, DOGE etc., to help manage and access your local full-node with greater ease and portability.  

Version:0.1.0
Pre-Production

Required Updates:

>Errors should not use res_fmt so they are allowed to freely propogate up.
Following this every catch block should use errors.handle(e).

>Secure logs:MongoDb to store all requests made and all responses sent out.

>Improved error handling: Recon->attempt re-establishing connection<- n times over a t time-interval.

time-interval:t is set to provide enough time for the system admin to correct the error.
repeated notifications are sent to the admin during t.

>Improve/further obfuscate authentication keystore. Give him more time to report undetected unauthorized entry.

**Initialization**

git clone https://github.com/BTCServices.git

./setup.bash <NODEPORT> <INTERFACEPORT> <WALLETUPDATEPORT> <RPCAUTH:Base64Encoded> (alternatively setup your environment variables manually)

 **Usage**

The primary utility of such an interface is to act as a proxy between a third-party client application and your local full node. This can be a variety of applications that require full node services.

**This code can easily be used and extended to support more client commands.**

** DO NOT STORE store any coin on this node if being used as a public node.
It is recommended _not to extend this interface to allow sendtoaddress/sendtomany etc._ as Eve can flood the interface with send requests which will execute as soon as the full node's walletpassphrase is entered.**

Use a offline transaction builder to create transactions and allow the interface to only broadcast a raw transaction hex.

** Ideal use case is private

* Ensure that your full node only accepts rpc from a locally running interface.js using rpcallow=127.0.0.1*

In such a scenario even a compromised rpcuser:rpcpassword will hinder Eve from connecting to the local node and attempting to spend.  

It is not recommended to hodl crypto on a public node. Funds received at such nodes must immediately be sent out to a cold wallet. This wallet will include transaction building functions and broadcast signed transactions to the public node. Receives to the public node can be entirely avoided if the wallet-notify function and HD wallet implementation are re-written as part of the cold wallet. This woudl be the most secure crypto-bank set up and the node interface will only serve you in transacting with the network in a trustless manner.



## interface.js

Serving JSON-RPC requests to the local node;

for the following commands @ given end points:

- **getnewaddress** @ curl -X POST "http://localhost:PORT/new_address"

- **validateaddress** @ curl -X POST "http://localhost:PORT>/validate_address" -d “address=<address>” (Used for local address checks)

- **gettransaction** @ curl -X POST "http://localhost:PORT>/tx_detail_local" -d “txid=<txid>” (Used for local address checks)

- **getrawtransaction+decoderawtransaction** @ curl -X POST "http://localhost:PORT/tx_detail_global" -d “txid=<txid>” (Used for checking any address)

- **listunspent** @ curl -X POST "http://localhost:PORT/get_utxo" -d "addresses=<address1>,<address2>,<address3>"

- **sendrawtransaction** @ curl -X POST "http://localhost:PORT/broadcastx" -d “hex=<tx_hex>”

- **importaddress** @curl -X POST "http://localhost:PORT/import_address" -d “address=<address>”

- **getbalance** @ curl -X POST "http://localhost:$NI_PORT/get_balance"


## receive_monitor.js

The primary utility of this txparser is to notify the node admin about incoming transactions.

Called via walletnotify in bitcoin.conf to parse details of a txid regarding ONLY incoming transactions i.e. receives.
It can be extended to support notifications for outgoing transactions as well by removing the section commented in the code as //remove this condition to allow send notify.

Returns txid, confirmations, address and amount.

Configure bitcoin.conf as follows:

*walletnotify = /path/to/script.sh %s*

**%s** passes the txid to this scrpit. The script can then curl -X POST "https://localhost:PORT/node_update" -d "txid=$1"

**$1** here accepts the first variable passed to the script i.e. the txid sent via wallet-notify.

## /lib/node_request.js

Defines a format for requests made to the local node.

## /lib/options.js

Defines a format for options to pass in requests.

Primarily used by interface.js to make requests to the local node. Can also be used by clients to interface.js.

## /lib/logs.js

Logs the result of receive_monitor.js locally.

## /lib/slack.js

General purpose slack notifier. Takes two arguments: *(data,title)*:

-*data* is the message being passed

-*title* is the name under which the message is passed.

Set environement variable Slack_Weburi to attack your own Slack Webhook.

## /lib/response_format.js

Defines a format for passing responses. All responses follow the format:

**{status:boolean, message:{}}**

Responses are created by calling:

- create(true,"message");

- create(false,"message");

eg. **{status: true, message: "Successfully saved"}**

## /lib/handle_errors.js

Defines all possible errors and creates error objects that display the entire stack trace to allow ease of debugging.

## Updates:

- Receive Logs currenly write on every confirmation (upgrade to only write after 1 confirmation)
- Currently errors get passed all the way up to the response to client. This should change to be logged just before the response and client only receives an error code.

### Notes:

All direct requests to the node are read with body.result and/or body.error.

All requests to internal servers are read with body.status and body.message.

## Support/Bug Reporting: zenchan@protonmail.com
