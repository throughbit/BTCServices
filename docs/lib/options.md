# options.js

## Overview

options.js is used to build a request, then passed as a parameter in requests made
to the local node, or any other destination url.

The build() function takes the following parameters:

For requests made to the local node:

* **destination** : `http://localhost:${NODE_PORT}`;

        const nodeurl = `http://localhost:${NODE_PORT}`;
        ...
        if(destination==='node'){
          options.url = nodeurl;
          ...

* **_method** : method from digibyte-cli

* **_id** : use your own name to identify this call

* **_params** : parameters required by this specific method

        options.body.params = _params;

For other general purpose requests:

* **_id & _method** are ignored.

        else {
          options.url = destination;
          options.body = _params;
        }

* **destination** : provide the complete destination url

* **_params** : passed as the entire request body.


## Usage

        const req_options = require('options.js');
        ...
        let _params = [];
        req_options.build("node",_params,"GetAddress","getnewaddress");
