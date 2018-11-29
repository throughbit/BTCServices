# interface.js

## Dependencies

* response_format.js as *res_fmt*
* options.js as *req_options*
* node_request.js as *node_request*
* handle_errors.js as *errors*

## Overview 

interface.js is an interface to a local node running at `http://localhost:${process.env.NODE}` defined in 2*.

Each endpoint defines a call to a single given method from the digibyte-cli application via JSON-RPC.

This can easily be extended to support more methods by defining _params specific to the method and passing the method name as the last argument to req_options.build() and endpoint name to node_request.req() as follows:

        let _params = req.body.address
        req_options.build("node",_params,"GetAddressInfo","getaddressinfo")
        .then((options)=>{
          node_request.req(options,"/get_addr_info")
          .then((resp)=>{
            res.send(res_fmt.create(true,resp));
          })        

Refer to *options* and *node_request* for how requests are built and sent.

All responses are sent out in the format defined by *res_fmt* and errors handled via filters defined in *errors*.
