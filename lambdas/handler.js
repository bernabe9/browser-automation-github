const { client } = require('octonode')

const Checks = require('../db/Checks')
const { generateResponse } = require('../helpers/requests')
const { updatePullRequestStatus } = require('../helpers/github')
const { states } = require('../constants')

module.exports.handler = async (event, context, callback) => {
  const githubClient = client(process.env.GITHUB_TOKEN)

  const body = JSON.parse(event.body)

  const isPR = body && 'pull_request' in body
  const ignoreEvent = !isPR || !['opened', 'reopened'].includes(body.action)
  if (ignoreEvent) {
    return callback(null, generateResponse(200, { message: 'Event ignored' }))
  }

  // developement code - filter by author bernabe9
  const isMine = body.pull_request.user.login === 'bernabe9'
  if (!isMine) {
    return callback(null, generateResponse(200, { message: 'Event ignored' }))
  }

  await updatePullRequestStatus({
    githubClient,
    params: { ...body, state: states.pending }
  })

  await Checks.put({
    sha: body.pull_request.head.sha,
    repository: body.repository.full_name,
    state: states.pending,
    prNumber: body.pull_request.number
  })

  return callback(
    null,
    generateResponse(200, { message: 'Test suite execution was triggered' })
  )
}
