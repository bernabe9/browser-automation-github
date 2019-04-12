const Checks = require('../db/Checks')

// lambda function that triggers the suite execution
module.exports.trigger = async event => {
  const { sha } = JSON.parse(event.Records[0].body)
  // const { url, sha } = JSON.parse(event.Records[0].body)

  // 0. get check row
  const check = await Checks.get({ sha })
  if (!check.Item) {
    return
  }

  // 2. update check row - add review app url (use this url to map sha - url)
  console.log('adding url to the check row')

  // 3. send a request to browser automation with concurrency = process.env.CONCURRENCY
}
