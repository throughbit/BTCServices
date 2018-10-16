/*
Slack Node
Developed at ThroughBit Technologies Pvt.Ltd
HYFERx Project
*/
//-o_O==========================================================~|
'use strict';
//-o_o===modules=================================================|
var errorSet = require('./errors.js');
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
  if (response)  console.log("Slacker says: ", response);
  if (err) console.log("Slacker says: ", err);
 });
}
//-o_o===exports=====================================================|
module.exports={update_slack};
//-o_o===fin=====================================================|
