function buildResponse({ statusCode = 200, headers = {}, body = {} }) {
  const response = {
    statusCode,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
      ...headers
    },

    body: JSON.stringify(body)
  };
  return response;
}

module.exports.buildResponse = buildResponse;
