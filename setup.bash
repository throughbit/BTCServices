#!/bin/bash
#Input variables:
#$1=RPCAUTH in Base64
#oooo--o--O:-------------------------------------------------------------------
init_break=oooo--o--O:---------------------------------------------------------
timestamp=$(date +%T)
bp="$HOME/.bashrc"

printf '$init_break\nBTCServices: Initialization \n'
printf 'Hop off court and chill for a bit... \n'
printf 'Will keep you updated on progress... \n'
printf 'Progress:[------] \n'

cd ..
mkdir node_logs
cd node_logs

printf "# Record Logging initialized\n# $timestamp\n# $init_break\n" >> $HOME/node_logs/rec_logs.log
printf "Set up log file & folder.\n"
printf "Side-effects: ../node_logs/rec_logs.log \n"
printf "Progress:[D---] \n"

printf "export NODE=5000" >> $bp
printf "export SERV=5050" >> $bp
printf "export W_UPD=5055" >> $bp
printf "export RPC_AUTH=$1" >> $bp
printf "export DREC_LPATH=$HOME/node_logs/rec_logs.log" >> $bp

source .bashrc

printf 'Created environment variables.\n'
printf 'Side-effects: $HOME/.bashrc \n';
printf 'Progress:[DO--] \n'

cd ..
cd BTCServices
npm install pm2

printf "PM2 installed."
printf "Side-effects: $HOME/.pm2"
printf 'Progress:[DON-] \n'

npm install

printf 'Installed required npm dependency modules.\n'
printf 'Side-effects:$HOME/BTCServices/node_modules \n';
printf 'Progress:[DONE] \n'

pm2 start interface.js tx.js --watch

printf "$init_break\nServers Initialized!\n$init_break\n"

pm2 start interface.js tx.js --watch

printf "Module:interface\n"
printf "Status:\n"
tail -10 $HOME/.pm2/logs/interface-error.log
tail -10 $HOME/.pm2/logs/interface-out.log
printf "$init_break\n"

printf "Module:tx\n"
printf "Status:\n"
tail -10 $HOME/.pm2/logs/tx-error.log
tail -10 $HOME/.pm2/logs/tx-out.log
printf "$init_break\n"

printf "If you get an error: logs can be found at $HOME/.pm2/logs/interface-error.\n"
printf "If you are unable to debug: Please forward your logs to zenchan@protonmail.com\n"
printf "$init_break\n"

printf "Use pm2 monit for live monitoring.\n"
printf "You have been served by lm0-chan.\n"
printf "$init_break\n"
