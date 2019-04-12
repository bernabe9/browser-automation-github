const updatePullRequestStatus = ({ githubClient, params }) => {
  const stateDescription = {
    success: 'Yay! All test passed!',
    pending: params.testExecution
      ? 'Running integration tests against your review app'
      : 'Waiting for the review app',
    error: 'Ups! Some test failed :('
  }
  const payload = {
    state: params.state,
    description: stateDescription[params.state],
    context: process.env.NAMESPACE,
    ...(params.testExecution && {
      target_url: `${process.env.WEB_URL}/suite-executions/${
        params.testExecution
      }`
    })
  }
  return new Promise((resolve, reject) => {
    githubClient.post(
      `/repos/${params.repository.full_name}/statuses/${
        params.pull_request.head.sha
      }`,
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
