"use strict";

const AWS = require("aws-sdk");
const request = require("request");
global.fetch = require("node-fetch");
const config = require("config.json");
const helperResponse = require("helpers/buildResponse");
AWS.config.update({ region: "us-east-1" });
var cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider();

exports.show = async (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  var params = { AccessToken: event.headers.Authorization };
  let user = await getUserCognito(params) 
  if (user.valide){
     user.footcoin = {}
    //  await getUserFootCoin(user.email, event.headers.Authorization)
    // if (user.footcoin.token) {
    //   user.footcoin = await getUserFootBalance(...user.footcoin)
    // }

    callback(null, helperResponse.buildResponse({ body:{user} }));
  }
  callback(null, helperResponse.buildResponse({ body: {message:'Credenciais inválidas'} , statusCode: 422 }));   
};


const getUserCognito = (params) =>
  new Promise((resolve, reject) => {
    cognitoidentityserviceprovider.getUser(params, function(err, data) {
      if (err) {
        reject(err);
      } else {        
        resolve(buildUser(data));
      }
    });
  });

const getUserFootCoin = (email, token) =>
  new Promise((resolve, reject) => {
    var options = {
      url: config.nashbit.host + config.nashbit.base_path + "/authenticator",
      method: "POST",
      json: {
        footcoin: {
          user: {
            email: email,
            token_cognito: token
          }
        }
      }
    };   
    request(options, (err, data, body) => {
      if (err) {
        reject(err);
      } else {       
        if (data.body.footcoin.resposta) {         
          resolve({
            header: data.headers["x-csrf-token"],
            token: data.body.footcoin.usuarioToken.token
          });
        } else {
          resolve({});
        }
      }
    });
  });

const getUserFootBalance = (header, token) =>
  new Promise((resolve, reject) => {
    var options = {
      url: `${config.nashbit.host}${config.nashbit.base_path}/authenticator`,
      method: "POST",
      headers: { "x-csrf-token": header },
      json: {
        footcoin: {
          user: {
            token: token
          }
        }
      }
    };
    request(options, (err, data, body) => {
      if (err) {
        reject(err);
      } else {
        resolve({
          contaVerificada: data.body.footcoin.contaVerificada,
          email: data.body.footcoin.email,
          message: data.body.footcoin.message,
          pais: data.body.footcoin.pais,
          usuarioToken: data.body.footcoin.usuarioToken,
          balance: balance.body.footcoin.balance,
          messageBalance: balance.body.footcoin.messageBalance
        });
      }
    });
  });



function buildUser(data) {
  return {
    email: getValue("email", data.UserAttributes),
    name: getValue("name", data.UserAttributes),
    middle_name: getValue("middle_name", data.UserAttributes),
    birthdate: getValue("birthdate", data.UserAttributes),
    cpf: getValue("given_name", data.UserAttributes),
    rg: getValue("custom:rg", data.UserAttributes),
    gender: getValue("gender", data.UserAttributes),
    zip_code: getValue("custom:zip_code", data.UserAttributes),
    street: getValue("custom:street", data.UserAttributes),
    number: getValue("custom:number", data.UserAttributes),
    neighborhood: getValue("custom:neighborhood", data.UserAttributes),
    complement: getValue("custom:complement", data.UserAttributes),
    state: getValue("custom:state", data.UserAttributes),
    city: getValue("custom:city", data.UserAttributes),
    house_phone: getValue("custom:house_phone", data.UserAttributes),
    phone_number: getValue("custom:phone_number", data.UserAttributes),
    valide: true
  };
}

function getValue(field, params) { 
  let attribute = params.find(k => k.Name === field)
  if(attribute){
    return attribute.Value
  }
  return "";
}
