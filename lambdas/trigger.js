const { get } = require('../helpers/https')
const Checks = require('../db/Checks')
const { applyQueryParams } = require('../helpers/requests')

// lambda function that triggers the suite execution
module.exports.trigger = async event => {
  const { url, sha } = JSON.parse(event.Records[0].body)

  const check = await Checks.get({ sha })
  if (!check.Item) {
    return
  }

  // update check row with the url
  await Checks.update({ sha, url })

  // Send a request to browser automation to start running the test suite
  const params = {
    suite: process.env.REVIEW_APP_SUITE_ID,
    webhook: `${process.env.GW_URL}/status-webhook`,
    concurrencyCount: process.env.CONCURRENCY,
    url
  }

  await get(applyQueryParams(`${process.env.LAMBDA_URL}/run-suite`, params))
}
