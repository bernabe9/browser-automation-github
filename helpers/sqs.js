const AWS = require('aws-sdk')

const sqs = new AWS.SQS({ region: 'us-east-1' })

const sendSqsMessage = ({
  message,
  QueueUrl = process.env.SQS_QUEUE_URL,
  dalayed = process.env.POST_DEPLOY_DELAY
}) => {
  const params = {
    QueueUrl,
    MessageBody: JSON.stringify(message),
    DelaySeconds: dalayed
  }
  return sqs.sendMessage(params).promise()
}

module.exports = {
  sendSqsMessage
}
