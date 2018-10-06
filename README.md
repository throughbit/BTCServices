# Node Services


NodeServer.js

Serving JSON-RPC to the full node for the following commands at given end points:

> getnewaddress@localhost:<port>/new_address
> gettransaction@localhost:<port>/tx_detail_local -d “txid=<input>” (Used for local address checks)
> getrawtransaction+decoderawtransaction@localhost:<port>/tx_detail_global -d “txid=<input>” (Used for checking any address)
> listunspent@localhost:<port>/get_utxo -d "address=<input>"
> sendrawtransaction@localhost:<port>/broadcasttx -d “hex=<input>”
  
TxParse.js

Called by rec-check.sh to parse details of a txid.
Returns txid, confirmations, address and amount.
