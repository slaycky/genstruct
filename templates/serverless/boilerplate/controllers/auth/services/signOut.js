'use strict';
global.fetch = require('node-fetch');
const {helperJson,helperBuildResponse} = require('../helpers/index')
const config = require('../configAws');
const Auth = require('../models/auth')
//const User = require('../models/user')
const AWS = require('aws-sdk');
AWS.config.update({
  "accessKeyId": config.accessKeyId,
  "secretAccessKey": config.secretAccessKey,
  "region": config.region
});
let cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider();

module.exports.signOut = function(event, context, callback) {
  var params = {
    AccessToken: event.headers.Authorization, /* required */
  };
  cognitoidentityserviceprovider.globalSignOut(params, function(err, data) {
    if (err) {
      callback(null, helperBuildResponse.buildResponse({
        body: { message: err.message },
        statusCode: 422
      }))
    } else {
      callback(null, helperBuildResponse.buildResponse({
        body: { },
        statusCode: 200
      }))
    }
  });
};