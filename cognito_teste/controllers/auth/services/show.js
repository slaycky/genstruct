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

exports.show = async (event, context, callback) => {
  var params = { AccessToken: event.headers.Authorization };
  let auth = new Auth();
  let user = await getUserCognito(auth,params)
  if (user.valide){
    callback(null, helperBuildResponse.buildResponse({ body:{user}, statusCode: 200  }));
  }else {  
    callback(null, helperBuildResponse.buildResponse({ body: {message:'Credenciais inválidas'} , statusCode: 422 }));  
  }

};


const getUserCognito = (user,params) =>
  new Promise((resolve, reject) => {
    cognitoidentityserviceprovider.getUser(params, function(err, data) {
      if (err) {
        reject(err);
      } else {        
        resolve(user.buildUser(data));
      }
    });
  });
