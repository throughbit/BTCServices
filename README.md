## Node Services


#NodeServer.js

Serving JSON-RPC to the full node for the following commands at given end points:

- getnewaddress @ curl -X POST "http://localhost:PORT/new_address"

- gettransaction @ curl -X POST "http://localhost:PORT>/tx_detail_local" -d “txid=<input>” (Used for local address checks)

- getrawtransaction+decoderawtransaction @ curl -X POST "http://localhost:PORT/tx_detail_global" -d “txid=<input>” (Used for checking any address)

- listunspent @ curl -X POST "http://localhost:PORT/get_utxo" -d "address=<input>"

- sendrawtransaction @ curl -X POST "http://localhost:PORT/broadcastx" -d “hex=<input>”
  
#TxParse.js

Called via wallet-notify to parse details of a txid regarding ONLY incoming transactions i.e. receives.
Returns txid, confirmations, address and amount.

#SlackNode.js

General purpose slack notifier. Takes two arguments: data,title:
-data is the message being passed 
-title is the name under which the message is passed.
