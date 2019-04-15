const queryString = require('query-string')

const generateResponse = (code, payload) => ({
  statusCode: code,
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true
  },
  body: JSON.stringify(payload)
})

const generateError = (code, err) =>
  generateResponse(code, { message: err.message })

const applyQueryParams = (url, params = {}) => {
  const queryParams = queryString.stringify(params)
  return `${url}?${queryParams}`
}

module.exports = {
  generateResponse,
  generateError,
  applyQueryParams
}
