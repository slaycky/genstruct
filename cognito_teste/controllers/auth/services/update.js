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

var cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider();

module.exports.update = async (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  if (helperJson.isJson(event.body,callback)) {
    let auth = new Auth();
    const data = JSON.parse(event.body);
    auth.set(data);
    if (auth.validate(callback)) {
      try {
        const updateAuth = await updateCognito(auth,event)
        console.log(updateAuth)
      callback(null, helperBuildResponse.buildResponse({ body: { message: 'Usuário editado com sucesso' }, statusCode: 200 }))
      }catch(e){
        callback(null, helperBuildResponse.buildResponse({ body: { error: e.message }, statusCode: 400 }))  
      }  
    } 
  }
};

const updateCognito = (user,event) =>

  new Promise((resolve, reject) => {
    var params = {      
        AccessToken: event.headers.Authorization,
        UserAttributes: user.setCognito(),
      };
     cognitoidentityserviceprovider.updateUserAttributes(params, function (err, data) {
        if (err) {
          console.log('ERROR',err)
          reject(err);
        } else {

          resolve(data);
        }
        }
    );
  });
