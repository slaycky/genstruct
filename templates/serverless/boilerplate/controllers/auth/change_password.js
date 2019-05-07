'use strict';

const AWS = require('aws-sdk');
global.fetch = require('node-fetch');
const config = require('config.json');

var cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider();

AWS.config.update({
  "accessKeyId": config.accessKeyId, 
  "secretAccessKey":config.secretAccessKey, 
  "region": config.region
});

module.exports.changepassword = function(event, context, callback) {
  if (isJson(event.body)) {
    const data = JSON.parse(event.body);
    var params = {
      AccessToken: event.headers.Authorization, /* required */
      PreviousPassword: getValue('previous_password', data), /* required */
      ProposedPassword: getValue('proposed_password', data) /* required */
    };
    cognitoidentityserviceprovider.changePassword(params, function(err, data) {
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

function getValue(field, params) {
  if ((field in params)) {
    return params[field]
  } else {
    return "";
  }
}