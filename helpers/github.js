const updatePullRequestStatus = ({ githubClient, params }) => {
  const stateDescription = {
    success: 'Yay! All test passed!',
    pending: params.suiteExecutionId
      ? 'Running integration tests against your review app'
      : 'Waiting for the review app',
    error: 'Ups! Some test failed :('
  }
  const payload = {
    state: params.state,
    description: stateDescription[params.state],
    context: process.env.NAMESPACE,
    ...(params.suiteExecutionId && {
      target_url: `${process.env.WEB_URL}/suite-executions/${
        params.suiteExecutionId
      }`
    })
  }
  return new Promise((resolve, reject) => {
    githubClient.post(
      `/repos/${params.repository}/statuses/${params.sha}`,
      payload,
      {},
      (err, status, body) => {
        console.log(body)
        if (err) {
          reject(err)
        } else {
          resolve()
        }
      }
    )
  })
}

module.exports = {
  updatePullRequestStatus
}
