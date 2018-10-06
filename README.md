# Node Services


NodeServer.js

Serving JSON-RPC to the full node for the following commands at given end points:

- getnewaddress@localhost:\<port\>/new_address
- gettransaction@localhost:\<port\>/tx_detail_local -d “txid=<input>” (Used for local address checks)
- getrawtransaction+decoderawtransaction@localhost:\<port\>/tx_detail_global -d “txid=<input>” (Used for checking any address)
- listunspent@localhost:\<port\>/get_utxo -d "address=<input>"
- sendrawtransaction@localhost:\<port\>/broadcastx -d “hex=<input>”
  
TxParse.js

Called via wallet-notify to parse details of a txid regarding incoming and outgoing transactions.
Returns txid, confirmations, type, address and amount.
