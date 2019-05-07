'use strict';

const AWS = require('aws-sdk');
global.fetch = require('node-fetch');
const config = require('config.json');

let User = require('model/user');

var cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider();

AWS.config.update({
  "accessKeyId": config.accessKeyId, 
  "secretAccessKey":config.secretAccessKey, 
  "region": config.region
});

module.exports.update = function(event, context, callback) {
  if (isJson(event.body)) {
    let user = new User();
    const data = JSON.parse(event.body);
    user.set(data);
    let requires = user.requireParams('comum');
    var params = {
      AccessToken: event.headers.Authorization, /* required */
      UserAttributes: user.setCognitoUpdate('comum',''),
    };
    cognitoidentityserviceprovider.updateUserAttributes(params, function(err, data) {
      if (err) {
        const response = {
          statusCode: 422,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true
          },
          body: JSON.stringify({ message: err.message })
        };
        callback(null, response);
      } else {
        const response = {
          statusCode: 200,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true
          },
          body: JSON.stringify(data)
        };
        callback(null, response);
      }
    });
  }
};

function isJson(str) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}