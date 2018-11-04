#!/bin/bash
#Input variables:
#$1=Node RPC Port
#$2=Interface Port
#$3=Wallet Update Port
#$4=RPC Auth encoded in Base64

#oooo--o--O:-------------------------------------------------------------------

init_break=oooo--o--O:---------------------------------------------------------
bp="$HOME/.bashrc"

timestamp() {
  date +"%T"
}

printf '\n'
printf "$init_break \nBTCServices: Initialization \n"
printf '\n'

printf '\n'
printf 'Progress:[------] \n'
printf '\n'

cd ..
mkdir node_logs
cd node_logs

printf '\n'
printf "# Record Logging initialized\n# $timestamp\n# $init_break\n" > rec_logs.log
printf "Created log file & folder.\n"
printf "Side-effects: ../node_logs/rec_logs.log \n"
printf '\n'

echo "#---Environment Variables-------------------------------------------------<._o>" >> $bp
echo "export NODE=$1" >> $bp
echo "export SERV=$2" >> $bp
echo "export W_UPD=$3" >> $bp
echo "export RPC_AUTH=$4" >> $bp
echo "export DREC_LPATH=$HOME/node_logs/rec_logs.log" >> $bp
echo "#--------------======o---O------------------------------------------------<._o>" >> $bp

source $HOME/.bashrc

printf '\n'
printf 'Defined environment variables.\n'
printf 'Side-effects: $HOME/.bashrc \n';
printf '\n'
printf "Progress:[D---] \n"
printf '\n'

cd ..
cd BTCServices
npm install pm2

printf '\n'
printf "PM2 installed."
printf "Side-effects: $HOME/.pm2"
printf '\n'
printf 'Progress:[DO--] \n'
printf '\n'

npm install

printf '\n'
printf 'Installed required npm dependency modules.\n'
printf 'Side-effects:$HOME/BTCServices/node_modules \n';
printf 'Progress:[DON-] \n'
printf '\n'

pm2 start interface.js tx.js --watch

printf '\n'
printf "$init_break\nServers Initialized!\n$init_break\n"
printf '\n'

printf '\n'
printf "Module:interface\n"
printf "Status:\n"
tail -10 $HOME/.pm2/logs/interface-error.log
tail -1 $HOME/.pm2/logs/interface-out.log
printf '\n'
printf "$init_break\n"
printf '\n'

printf '\n'
printf "Module:tx\n"
printf "Status:\n"
tail -10 $HOME/.pm2/logs/tx-error.log
tail -1 $HOME/.pm2/logs/tx-out.log
printf '\n'
printf "$init_break\n"
printf '\n'

printf '\n'
printf "If you get an error: logs can be found at $HOME/.pm2/logs.\n"
printf "If you are unable to debug: Please forward your logs to zenchan@protonmail.com\n"


printf "Use pm2 monit for live monitoring.\n"
printf '\n'
printf "$init_break\n"
printf '\n'

printf '\n'
printf 'Progress:[DONE] \n'
printf "You have been served by lm0-chan.\n"
timestamp
printf '\n'
printf '\n'
printf "$init_break\n"
printf '\n'
