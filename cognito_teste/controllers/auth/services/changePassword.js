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

module.exports.changePassword = function(event, context, callback) {
  if (helperJson.isJson(event.body,callback)) {
    let auth = new Auth();
    const data = JSON.parse(event.body);
    auth.set(data);
    if (auth.requireChangePasswordParams(callback)) {
    var params = {
      AccessToken: event.headers.Authorization, /* required */
      PreviousPassword: auth.password, /* required */
      ProposedPassword: auth.new_password /* required */
    };
    cognitoidentityserviceprovider.changePassword(params, function(err, data) {
      if (err) {
          callback(null, helperBuildResponse.buildResponse({
            body: { message: 'Credenciais inválidas' },
            statusCode: 422
          }))
      } else {
        callback(null, helperBuildResponse.buildResponse({
          body:{ message: 'Senha alterada com sucesso.' },
          statusCode: 200
        }))
      }
    });
  }
}
};

