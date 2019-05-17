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

module.exports.confirmCode = async (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  if (helperJson.isJson(event.body,callback)) {
    let auth = new Auth();
    const data = JSON.parse(event.body);
    auth.set(data);
    if (auth.requireParamsConfirm(callback)) {
      AWS.config.update({ region: 'us-east-1' });
      try {
        const code = await confirmCodeUser(auth)
        console.log('code',code)
        if(!code.error){
          callback(null, helperBuildResponse.buildResponse({ body: { message: 'Codigo confirmado com sucesso' }, statusCode: 200 }))
        }else{
          callback(null, helperBuildResponse.buildResponse({ body: { message: code.error.message }, statusCode: code.error.statusCode }))
        }
    
      }catch(e){
        console.log('e',e)
        callback(null, helperBuildResponse.buildResponse({ body: { error: 'codigo inválido' }, statusCode: 422 }))  
      }  
    } 
  } 
};


const confirmCodeUser = user =>
  new Promise((resolve, reject) => {
  var params = {
    ClientId: config.pool_cognito.ClientId,
    SecretHash: user.hashSecret(config.pool_cognito.SecretHash, user.phone_number, config.pool_cognito.ClientId),
    ConfirmationCode: user.code,
    Username: user.phone_number,
  };
  cognitoidentityserviceprovider.confirmSignUp(params, function(err, data) {
    if (err) {
      resolve({error: err});
    } else {
      resolve(data);
    }
  });
})