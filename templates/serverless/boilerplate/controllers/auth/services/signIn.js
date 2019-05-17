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

module.exports.signIn = async (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  if (helperJson.isJson(event.body,callback)) {
    let auth = new Auth();
    const data = JSON.parse(event.body);
    auth.set(data);
    if (auth.requireLoginParams(callback)) {
      try {
      let user = await sigInCognito(auth);
      if (user.token) {
        callback(null,helperBuildResponse.buildResponse({
          body: {},
          headers: {
            "access-token": user.token,
            "Access-Control-Expose-Headers": "access-token"
          },
          statusCode: 200
        }))
      } else {
        callback(null, helperBuildResponse.buildResponse({
          body: { message: "Erro ao validar credenciais" },
          statusCode: 401
        }))
      }
    }catch(e){
      return helperBuildResponse.buildResponse({
        body: { message: e.message},
        statusCode: 400
      });
    }
    }
  }
};

const sigInCognito = (auth) =>
  new Promise((resolve, reject) => {
    var params = {
      AuthFlow: "USER_PASSWORD_AUTH" /* required */,
      ClientId: config.pool_cognito.ClientId /* required */,
      AuthParameters: {
        USERNAME: auth.phone_number,/*Can be changed if username is email*/
        PASSWORD: auth.password,
        SECRET_HASH: auth.hashSecret(config.pool_cognito.SecretHash, auth.phone_number, config.pool_cognito.ClientId), /* If your client has secret hash*/ 
      }
    };
    cognitoidentityserviceprovider.initiateAuth(params, (err, data) => {
      if (err) {
        console.log(err)
        reject(err)
      } else {
        resolve({ token: data.AuthenticationResult.AccessToken });
      }
    });
  });

