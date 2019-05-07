'use strict';

const AWS = require('aws-sdk');
global.fetch = require('node-fetch');
const config = require('config.json');
let User = require('model/user');
module.exports.create = function (event, context, callback) {
  if (isJson(event.body)) {
    let user = new User();
    const data = JSON.parse(event.body);
    user.set(data);
    let requires = user.requireParams('comum');
    if (requires.status) {
      let validates = user.validate()
      if (validates.status) {
        AWS.config.update({
          "accessKeyId": config.accessKeyId,
          "secretAccessKey": config.secretAccessKey,
          "region": config.region
        });
        var cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider();
        let params_find = {
          UserPoolId: config.pool_cognito.UserPoolId,
          /* required */
          AttributesToGet: [
            'given_name', 'name'
          ],
          Filter: 'given_name = "' + user.cpf + '"',
          Limit: 1
        };
        cognitoidentityserviceprovider.listUsers(params_find, function (err, data) {
          if (err) {
            const response = {
              statusCode: 422,
              headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true,
              },
              body: JSON.stringify({ message: err.message, code: err.code })
            };
            callback(null, response);
          } else {
            if (data.Users.length == 0) {
              var params = {
                ClientId: config.pool_cognito.ClientId,
                Password: user.password,
                Username: user.email,
                UserAttributes: user.setCognito('comum', ''),
              };
              cognitoidentityserviceprovider.signUp(params, function (err, data) {
                if (err) {
                  const response = {
                    statusCode: 422,
                    headers: {
                      'Access-Control-Allow-Origin': '*',
                      'Access-Control-Allow-Credentials': true
                    },
                    body: JSON.stringify({ message: err.message, code: err.code })
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
                  'Access-Control-Allow-Credentials': true,
                },
                body: JSON.stringify({ message: 'An account with the given CPF already exists.', code: 'CPFExistsException' })
              };
              callback(null, response);
            }
          }
        });
      } else {
        const response = {
          statusCode: 422,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true
          },
          body: JSON.stringify({ message: validates.message, code: validates.code })
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
  } else {
    const response = {
      statusCode: 422,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({ message: "Parametros inválidos", code: "000" })
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