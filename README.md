# Node Services

## Be your own bank!

A basic node interface for BTC forked crypto-networks like DGB, VTC, DOGE etc., to help manage and access your local full-node with greater security, ease and portability;

### Version:0.1.1
**(Pre-Production)**

## Initialization

          cd $HOME
          nano .bashrc

Set environment variables in accordance to env.md

          source .bashrc
          git clone https://github.com/BTCServices.git
          cd BTCServices
          npm install pm2@latest -g
          npm install
          pm2 start interface.js receive_monitor.js --watch

## Usage

        curl -X POST "http://localhost:$NI_PORT/new_address"

        curl -X POST "http://localhost:$NI_PORT/network_info"

        curl -X POST "http://localhost:$NI_PORT/get_balance"

        curl -X POST "http://localhost:$NI_PORT/import_address" -d 'address=SZt2J7DFq6RTbZ1eT1KDSRnRxLYV5gQt8f'

/get_utxo => listunspent only works on local addresses. non-local address must be imported using the above /import_address => importaddress

        curl -X POST "http://localhost:$NI_PORT/get_utxo/" -d 'addresses=SZt2J7DFq6RTbZ1eT1KDSRnRxLYV5gQt8f'

        curl -X POST "http://localhost:$NI_PORT/validate_address/" -d "address=DQPivtsrVEU1WnKuLbM7vfzQUp64Rp7u2k"

        curl -X POST "http://localhost:$NI_PORT/tx_detail_local/" -d "txid=206acbf272337e46082f9c3ba6630a1a254c8ab9c706751f889f541e750bb3b9"

/tx_detail_global requires bitcoin.conf to contain **txindex=1**

        curl -X POST "http://localhost:$NI_PORT/tx_detail_global/" -d "txid=097b262b3755b952f9e4beaa3290df36fd73aefbf19062c04f767d8ba97b1086"



/lib/node_request.js defines a standard for making requests to the interface via nodejs.

The primary utility of such an interface is to act as a proxy between a third-party client application and your local full node.

In providing full-node services it is recommended not to allow clients direct access to the node rpc protocol.

**Ensure that your full node only accepts rpc from a locally running interface.js using **rpcallow=127.0.0.1** in bitcoin.conf**


*If you are running a public node please wear a helmet.*

## Required Updates

* Secure logs:MongoDb to store all requests made and all responses sent out.

* Improved error handling: Recon->attempt re-establishing connection<- n times over a t time-interval.

time-interval:t is set to provide enough time for the system admin to correct the error.
repeated notifications are sent to the admin during t.

* Improve/further obfuscate authentication keystore. Give him more time to report undetected unauthorized entry.

* Receive Logs currenly write on every confirmation (upgrade to only write after 1 confirmation)

* Currently errors get passed all the way up to the response to client. This should change to be logged just before the response and client only receives an error code.

## Notes:

All direct requests to the node are read with body.result and/or body.error.

All requests to internal servers are read with body.status and body.message.

Refer to /docs for details on individual modules.

## Support/Bug Reporting: viz@throughbit.com
