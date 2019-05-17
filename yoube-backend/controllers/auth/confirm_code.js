'use strict';

const AWS = require('aws-sdk');
global.fetch = require('node-fetch');
const config = require('config.json');

module.exports.confirm = function(event, context, callback) {
  if (isJson(event.body)) {
    const data = JSON.parse(event.body);
    let requires = requireParams(data);
    if (requires.status) {
      AWS.config.update({ region: 'us-east-1' });
      var cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider();
      var params = {
        ClientId: config.pool_cognito.ClientId,
        ConfirmationCode: data.code,
        Username: data.email,
      };
      cognitoidentityserviceprovider.confirmSignUp(params, function(err, data) {
        if (err) {
          const response = {
            statusCode: 422,
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Credentials': true
            },
            body: JSON.stringify(err)
          };
          callback(null, response);
        } else {
          const response = {
            statusCode: 200,
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Credentials': true
            },
            body: JSON.stringify(data)
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
        body: JSON.stringify({ message: "Params missing " + requires.parameter })
      };
      callback(null, response);
    }
  } else {
    const response = {
      statusCode: 422,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({ message: "Params missing " + requires.parameter })
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
}

function getValue(field, params) {
  if ((field in params)) {
    return params[field]
  } else {
    return "";
  }
}

function requireParams(params) {
  let required = { status: true, parameter: '' }
  if (!('code' in params)) {
    required.status = false;
    required.parameter = 'Code';
  } else if (!('email' in params)) {
    required.status = false;
    required.parameter = 'E-mail';
  }
  return required;
}