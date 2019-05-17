const config = require("./config.json");
const helperResponse = require("helpers/buildResponse");
const AWS = require("aws-sdk");
AWS.config.update({ region: "us-east-1" });
const User = require("model/user");
var cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider();

exports.signin = async (event, context, callback) => {
  const data = JSON.parse(event.body);
  let login = data.email;
  let password = data.password;
    let user = await sigInCognito(login, password);
    if (user.token) {
      return helperResponse.buildResponse({
        body: login,
        headers: {
          accesstoken: user.token,
          "Access-Control-Expose-Headers": "accesstoken"
        }
      });
    } else {
      return helperResponse.buildResponse({
        body: { message: "Erro ao validar credenciais" },
        statusCode: 401
      });
    }
};



const sigInCognito = (email, password) =>
  new Promise((resolve, reject) => {
    var params = {
      AuthFlow: "USER_PASSWORD_AUTH" /* required */,
      ClientId: config.pool_cognito.ClientId /* required */,
      AuthParameters: {
        USERNAME: email,
        PASSWORD: password
      }
    };
    cognitoidentityserviceprovider.initiateAuth(params, (err, data) => {
      if (err) {
        resolve(err)
      } else {
        resolve({ token: data.AuthenticationResult.AccessToken });
      }
    });
  });

