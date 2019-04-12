const qs = require('qs')

const Checks = require('../db/Checks')
const { sendSqsMessage } = require('../helpers/sqs')
const { generateResponse } = require('../helpers/requests')

module.exports.handler = async (event, context, callback) => {
  const params = qs.parse(event.body)

  const check = await Checks.get({ sha: params.head_long })
  if (!check.Item) {
    return callback(
      null,
      generateResponse(200, { message: "Check item doesn't exist" })
    )
  }

  // push message to the queue with delay
  await sendSqsMessage({ message: { url: params.url, sha: params.head_long } })

  return callback(null, generateResponse(200, { message: 'success' }))
}
