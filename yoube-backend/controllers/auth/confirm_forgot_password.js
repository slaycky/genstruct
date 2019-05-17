'use strict';

const AWS = require('aws-sdk');
global.fetch = require('node-fetch');
const config = require('config.json');

AWS.config.update({ region: 'us-east-1' });
var cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider();

var params = {
  ClientId: config.pool_cognito.ClientId, /* required */
  ConfirmationCode: null, /* required */
  Password: null, /* required */
  Username: null, /* required */
  // AnalyticsMetadata: {
  //   AnalyticsEndpointId: 'STRING_VALUE'
  // },
  // SecretHash: 'STRING_VALUE',
  // UserContextData: {
  //   EncodedData: 'STRING_VALUE'
  // }
};

module.exports.confirmforgotpassword = function(event, context, callback) {
  if (isJson(event.body)) {
    const data = JSON.parse(event.body);

    params.ConfirmationCode = getValue('code', data);
    params.Username = getValue('email', data)
    params.Password = getValue('password', data);

    cognitoidentityserviceprovider.confirmForgotPassword(params, function(err, data) {
      if (err) {
        const response = {
          statusCode: 422,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true
          },
          body: JSON.stringify({ message: "Credenciais inválidas" })
        };
        callback(null, response);
      } else {
        const response = {
          statusCode: 200,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true
          },
          body: JSON.stringify({ email: params.Username })
        };
        callback(null, response);
      }
    });
  } else {
    const response = {
      statusCode: 422,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({ message: "Credenciais inválidas" })
    };
    callback(null, response);
  }
};

function isJson(str) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
};

function getValue(field, params) {
  if ((field in params)) {
    return params[field]
  } else {
    return "";
  }
};