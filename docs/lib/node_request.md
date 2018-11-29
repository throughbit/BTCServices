# node_request.js

**Overview**

node_request.js is a template for requests made to the local full node.

It takes two parameters options and ep_name.

Options are created using the options.js module. 

ep_name is only used for clarity in error logging. 

bitcoin-cli JSON-RPC responses are in the format 
{
  result:"",
  error:"",
  id:""
}
and accordingly resolved or rejected.

**Usage**

const node_request = require('node_request.js');

node_request.req(options,"/get_utxo")


