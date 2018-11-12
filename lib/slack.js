/*
Slack Node
Developed at ThroughBit Technologies Pvt.Ltd
HYFERx Project
*/
//-o_O==========================================================~|
'use strict';
//-o_o===modules=================================================|
var res_fmt = require('./response_format.js');
var Slack = require ('slack-node');
//-o_O===init===================================================~|
var webhookUri = process.env.Slack_Weburi;
//-o_O===SlackNode==============================================~|
function update_slack(data,title){
 var slack = new Slack();
 slack.setWebhook(webhookUri);
 slack.webhook({
  channel: "#node-updates",
  username: title,
  icon_emoji: ":ghost:",
  text: data
  }, function(err, response) {
  if (response){
   let message=res_fmt.create(true,`Slack response: ${response}`);
   console.log("Slacker says: ", message);
   return message;
  }
  if (err){
   let message=res_fmt.create(false,`Slack error: ${err}`);
   console.log("Slacker says: ", message);
   return message;
  }
 });
}
//-o_o===exports=====================================================|
module.exports={update_slack};
//-o_o===fin=====================================================|
