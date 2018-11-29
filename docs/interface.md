# interface.js

**Dependencies**

1*../lib/response_format.js
2*../lib/options.js
3*../lib/node_request.js
4*../lib/handle_errors.js

**Overview**

interface.js is an interface to a local node running at `http://localhost:${process.env.NODE}` defined in 2*.

Each endpoint defines a call to a single given method from the node-cli application via JSON-RPC.

This can easily be extended to support more methods by defining _params specific to the method and passing the method name as the last argument to req_options.build and endpoint name to node_request.req as follows:

app.post('get_address_info',....)...
...
let _params = req.body.address;
req_options.build("node",_params,"GetAddressInfo","getaddressinfo");
...
node_request.req(options,"/get_address_info");
...

Refer to docs of 2* & 3* for more details on how options are built and how requests to the node are made. 


All responses are sent out in the format defined in 1* and errors handles in accordance to 4*. 






