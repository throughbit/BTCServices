# Node Services


## NodeServer.js

Serving JSON-RPC to the full node for the following commands at given end points:

- **getnewaddress** @ curl -X POST "http://localhost:PORT/new_address"

- **gettransaction** @ curl -X POST "http://localhost:PORT>/tx_detail_local" -d “txid=insert-txid” (Used for local address checks)

- **getrawtransaction+decoderawtransaction** @ curl -X POST "http://localhost:PORT/tx_detail_global" -d “txid=insert-txid” (Used for checking any address)

- **listunspent** @ curl -X POST "http://localhost:PORT/get_utxo" -d "addresses=insert-addresses-array"

- **sendrawtransaction** @ curl -X POST "http://localhost:PORT/broadcastx" -d “hex=insert-txhex”
  
## TxParse.js

Called via wallet-notify to parse details of a txid regarding ONLY incoming transactions i.e. receives.
Returns txid, confirmations, address and amount.

## SlackNode.js

General purpose slack notifier. Takes two arguments: *(data,title)*:
-*data* is the message being passed 

-*title* is the name under which the message is passed.

## errors.js

errors defines a format for passing responses. All responses follow the format: 

**{status:" ", message:" "}**

status 0 = Fail / False

status 1 = Success / True

This strays away from the traditional C-standard since the boolean-int equivalent in JS is 0 = false and 1 = true. 
This allows easy checks via if(status){}

Responses are created by calling:

- errorFunc("fail","message") 

- errorFunc("success","message")

eg. **{status: 0, message: "Successfully saved your shit"}**
