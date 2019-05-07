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

module.exports.signout = function(event, context, callback) {
  var params = {
    AccessToken: event.headers.Authorization, /* required */
  };
  cognitoidentityserviceprovider.globalSignOut(params, function(err, data) {
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
};