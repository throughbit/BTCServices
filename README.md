# Node Services
Be your own bank!

A basic node interface for BTC forked crypto-networks like DGB, VTC, DOGE etc., to help you manage and access your full-node with greater ease and portability.  

To get up an running:

initialize environment variables for:
 - **NODE** : local node's rpcport 
 - **SERV** : the port on which this interface will run 
 - **W_UPD** : a port for wallet-notify updates
 - **RPC_AUTH** : the local node's rpcuser:rpcpassword encoded in Base64
 - **REC_LOG** : path to receives.log
 
 **Usage**
 
The primary utility of such an interface is to act as a proxy between a third-party/the public and your local crypto full node. This third party could be a web/mobile app you develop to access your full-node from anywhere in the world.

It is crucial to restrict third-party access to only a select few functions on your node. 

**This code can easily be used and extended to support more client commands.**

**It is recommended _not to extend this interface to allow sendtoaddress/sendtomany etc._ as Eve can flood the interface with send requests which will execute as soon as the full node's walletpassphrase is entered.**

Use a offline transaction builder to create transactions and allow the interface to only broadcast a raw transaction hex.

*Ensure that your full node only accepts rpc from a locally running NodeServer.js using rpcallow=127.0.0.1*

In such a scenario even a compromised rpcuser:rpcpassword will hinder Eve from connecting to the local node and attempting to spend.  

It is not recommended to hodl crypto on a public node. Funds received at such nodes must immediately be sent out to a cold wallet. This wallet will include transaction building functions and broadcast signed transactions to the public node. Receives to the public node can be entirely avoided if the wallet-notify function and HD wallet implementation are re-written as part of the cold wallet. This woudl be the most secure crypto-bank set up and the node interface will only serve you in transacting with the network in a trustless manner. 

## Security Notes:
All sensitive variables are stored as environment variables. 
It is recommended that the user of these modules futher obfuscate sensitive data (such as authentication) by sharding the data stored in env variables and using another script to put the shards together and reconstitute the original data. Such a script must stay private. For higher levels of security, 2FA can be added to these scripts.

**If you have any recommendations on best practices for storing authentication tokens on a server, please leave a message :)**

## NodeServer.js

Serving JSON-RPC to the full node for the following commands at given end points:

- **getnewaddress** @ curl -X POST "http://localhost:PORT/new_address"

- **validateaddress** @ curl -X POST "http://localhost:PORT>/validate_address" -d “address=insert-address” (Used for local address checks)

- **gettransaction** @ curl -X POST "http://localhost:PORT>/tx_detail_local" -d “txid=insert-txid” (Used for local address checks)

- **getrawtransaction+decoderawtransaction** @ curl -X POST "http://localhost:PORT/tx_detail_global" -d “txid=insert-txid” (Used for checking any address)

- **listunspent** @ curl -X POST "http://localhost:PORT/get_utxo" -d "addresses=insert-addresses-array"

- **sendrawtransaction** @ curl -X POST "http://localhost:PORT/broadcastx" -d “hex=insert-txhex”


## TxParse.js

Called via wallet-notify to parse details of a txid regarding ONLY incoming transactions i.e. receives.
Returns txid, confirmations, address and amount.

The primary utility of this txparser is to notify the node admin about incoming transactions or receives. 
It can be extended to support notifications for outgoing transactions by removing the section commented in the code as //remove this condition to allow send notify.
For this reason this function has been isolated from NodeServer.js, to maintain usage of S_PORT exclusively to interface your full node. 

Configure bitcoin.conf as follows:

*wallet-notify = /path/to/script.sh %s*

**%s** passes the txid to this scrpit. The script can then curl -X POST "https://localhost:PORT/node-update" -d "txid=$1"

**$1** here accepts the first variable passed to the script i.e. the txid sent via wallet-notify.


## SlackNode.js

General purpose slack notifier. Takes two arguments: *(data,title)*:

-*data* is the message being passed 

-*title* is the name under which the message is passed.

Set environement variable Slack_Weburi to attack your own Slack Webhook.

## errors.js

errors defines a format for passing responses. All responses follow the format: 

**{status:true/false, message:" ", message_array: [], message_object:{}}**

status 0 = Fail / False

status 1 = Success / True

This strays away from the traditional C-standard since the boolean-int equivalent in JS is 0 = false and 1 = true. 
This allows easy checks via if(status){}

Responses are created by calling:

- errorFunc("fail","message") 

- errorFunc("success","message")

eg. **{status: true, message: "Successfully saved.", message_array:[], message_object:{}}**

## Updates:

- complete sending of requests in errorSet format.
- ensure that recievers handle responses correctly.

