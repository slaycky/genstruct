function isJson(str,callback) {
  try {
    JSON.parse(str);
  } catch (e) {
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
  return true;
}
module.exports.isJson = isJson;