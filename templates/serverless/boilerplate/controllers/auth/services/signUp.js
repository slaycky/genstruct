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
module.exports.signUp = async (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  if (helperJson.isJson(event.body,callback)) {
    let auth = new Auth();
    const data = JSON.parse(event.body);
    auth.set(data);
    if (auth.requireParams(callback)) {
      const validates = auth.validate(callback)
      if (validates) {
        try {
          const createAuth = await createCognito(auth)
          console.log(createAuth)
          if(!createAuth.error){
            callback(null, helperBuildResponse.buildResponse({ body: { message: 'Usuário criado com sucesso' }, statusCode: 200 }))
          }else{
            callback(null, helperBuildResponse.buildResponse({ body: { message: createAuth.error.message }, statusCode: createAuth.error.statusCode }))
          }        
        }catch(e){
          callback(null, helperBuildResponse.buildResponse({ body: { error: e.message }, statusCode: e.statusCode }))  
        }  
      } 
    } 
  }

};
const createCognito = user =>
  new Promise((resolve, reject) => {
    var params = {      
        ClientId: config.pool_cognito.ClientId,
        SecretHash: user.hashSecret(config.pool_cognito.SecretHash, user.phone_number, config.pool_cognito.ClientId),
        Password: user.password,
        Username: user.phone_number,
        UserAttributes: user.setCognito(),
      };
     cognitoidentityserviceprovider.signUp(params, function (err, data) {
        if (err) {
          resolve({error: err});
        } else {

          resolve(data.UserSub);
        }
        }
    );
  });

