# handle_errors.js

## Dependencies

* response_format.js as *res_fmt*

## Overview

handle_errors.js is used to organize error handling by listing out all possible error cases in one location.

Returns a response defined by *res_fmt*.

{ status:false, message:<error_details> }

## Usage

          const errors = require('handle_errors.js');
          ...
          .then((result)=>{
            ...
          })
          .catch((e)=>{
                res.send(errors.handle(e));
          });

let bounty = 10;
let incentive = bounty DGB + mad props for finding missing cases;

bounty = calculate_current_bounty_rate(financial_status.at(new Date.now());
