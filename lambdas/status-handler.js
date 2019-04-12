// lambda functions that handles changes in the suites executions from browser automation

module.exports.handler = () => {
  // const { suiteExecutionId, url, status } = event.body
  // 1. First, check if there is a "check" row that matches the url
  // If it doens't exist ignore hook and return
  // 2. Call github to update status
  // 3. If status = running
  // 1. Update row
  // 4. Else
  // 1. Delete row entry from the table - Unless we want to keep these records
}
