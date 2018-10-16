/*
errors
Developed at ThroughBit Technologies Pvt.Ltd
HYFERx Project
*/
//-o_O============================================================~|
'use strict';

function errorFunc(type,msg,msg_arr,msg_obj){

 var fail_response = {
 "status": false,
 "message": "",
 "message_array":[],
 "message_object":{}
 };
 var success_response = {
 "status": true,
 "message": "",
 "message_array":[],
 "message_object":{}
 };

 if(type==='fail'){
  let response = fail_response;
  response.message = msg;
  response.message_array = msg_arr;
  response.message_object= msg_obj;
  return response;
 }

 if(type==='success'){
  let response = success_response;
  response.message = msg;
  response.message_array = msg_arr;
  response.message_object= msg_obj;
  return response;
 }

}
//-o_O===Exports================================================~|
module.exports = {errorFunc};
//-o_O===fin====================================================~|
