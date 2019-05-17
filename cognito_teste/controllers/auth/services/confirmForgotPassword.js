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

module.exports.confirmForgotPassword = function(event, context, callback) {
  if (helperJson.isJson(event.body,callback)) {
    let auth = new Auth();
    const data = JSON.parse(event.body);
    auth.set(data);
    if (auth.requireConfirmForgotPasswordParams(callback)) {
      var params = {
        ClientId: config.pool_cognito.ClientId, /* required */
        ConfirmationCode: auth.code, /* required */
        Password: auth.password, /* required */
        Username: auth.phone_number, /* required */
        SecretHash: auth.hashSecret(config.pool_cognito.SecretHash, auth.phone_number, config.pool_cognito.ClientId)
        // AnalyticsMetadata: {
        //   AnalyticsEndpointId: 'STRING_VALUE'
        // },
        // SecretHash: 'STRING_VALUE',
        // UserContextData: {
        //   EncodedData: 'STRING_VALUE'
        // }
      };

    cognitoidentityserviceprovider.confirmForgotPassword(params, function(err, data) {
      if (err) {
        console.log('error',err)
        callback(null, helperBuildResponse.buildResponse({
          body: { message: 'Credenciais inválidas' },
          statusCode: 422
        }))
      } else {
        callback(null, helperBuildResponse.buildResponse({
          body: { phone_number: params.Username },
          statusCode: 200
        }))
      }
    });
  } 
}
};
