# response_format.js

## Overview

resposne_format.js defines a format for responses that can be easily parsed through.

It is recommended to only be used only at the res.send()/highest level; in response to the client.

Clients can use the status field to determine the nature of the response (success/failure),
and accordingly proceed with their program logic.

## Usage

**Server side***
Creating a res_fmt type response:

        const res_fmt = require('response_format.js');

        res.send(res_fmt.create(true,{this:cool,that:meh}));

**Client side**
Parsing a res_fmt response:

      if(body.status){
        do...
      }
      else{
        do...
      }
