# logs.js

## Overview

logs.js is used to log all receives at the local node.

Log format is defined by:

**Success Format:**

         const s_log={
           "time":new Date(unix_timestamp * 1000).format('h:i:s'),
           "status": "success",
           "message": "Received Payments.",
           "txid": data.txid,
           "confirmations":data.confirmations,
           "tx_details": data.tx_details,
          }

**Failure Format:**

        const f_log={
           "time":new Date(unix_timestamp * 1000).format('h:i:s'),
           "status": "fail",
           "message":`Error in reading receives`,
           "txid": data
          }

## Usage

        const logs = require('logs.js');
        ...

To log success:

        ...
        logs.receives(true,data);

To log failure:

        ...
        logs.receives(false,data);
