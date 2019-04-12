const AWS = require('aws-sdk')

const dynamoDb = new AWS.DynamoDB.DocumentClient()

class Checks {
  static async put(data) {
    const timestamp = new Date().getTime()
    const params = {
      TableName: process.env.CHECKS_TABLE,
      Item: {
        sha: data.sha,
        createdAt: timestamp,
        updatedAt: timestamp,
        state: data.state,
        repository: data.repository,
        prNumber: data.prNumber
      }
    }
    await dynamoDb.put(params).promise()
    return params
  }

  static async get(key) {
    const params = {
      TableName: process.env.CHECKS_TABLE,
      Key: key
    }
    const result = await dynamoDb.get(params).promise()
    return result
  }
}

module.exports = Checks
