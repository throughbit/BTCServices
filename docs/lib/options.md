# options.js

**Overview**

options.js is used to build options to be passed to requests to the local node, or any other destination.

**Usage**

const req_options = require('options.js');

req_options.build("node",_params,_id,_method);

_method: method from node-cli
_id: Use your own name to identify this call
_params: parameters required by this specific method

If you wish to make a normal request _id & _method are ignored. 
The full url must be provided as the destination parameter.
_params will be passed as the request body.









