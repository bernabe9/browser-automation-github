const { client } = require('octonode')

const Checks = require('../db/Checks')
const { updatePullRequestStatus } = require('../helpers/github')
const { states } = require('../constants')

const mapStates = {
  success: states.success,
  error: states.error,
  pending: states.pending,
  running: states.pending
}

// lambda functions that handles changes in the suites executions from browser automation
module.exports.handler = async event => {
  const params = JSON.parse(event.body)

  // verify if there is a check row that matches the url
  const checksQuery = await Checks.query(params.url)

  if (checksQuery.Count === 0) {
    return
  }

  const check = checksQuery.Items[0]

  // call github to update status
  const githubClient = client(process.env.GITHUB_TOKEN)
  await updatePullRequestStatus({
    githubClient,
    params: {
      repository: check.repository,
      sha: check.sha,
      suiteExecutionId: params.id,
      state: mapStates[params.status]
    }
  })

  await Checks.updateState({ sha: check.sha, state: mapStates[params.status] })
}
