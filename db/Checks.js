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

  static async update(data) {
    const timestamp = new Date().getTime()
    const params = {
      TableName: process.env.CHECKS_TABLE,
      Key: { sha: data.sha },
      ExpressionAttributeNames: {
        '#url': 'url'
      },
      ExpressionAttributeValues: {
        ':updatedAt': timestamp,
        ':url': data.url
      },
      UpdateExpression: 'SET #url = :url, updatedAt = :updatedAt',
      ReturnValues: 'ALL_NEW'
    }
    await dynamoDb.update(params).promise()
  }

  static async updateState({ sha, state }) {
    const timestamp = new Date().getTime()
    const params = {
      TableName: process.env.CHECKS_TABLE,
      Key: { sha },
      ExpressionAttributeNames: {
        '#st': 'state'
      },
      ExpressionAttributeValues: {
        ':state': state,
        ':updatedAt': timestamp
      },
      UpdateExpression: 'SET #st = :state, updatedAt = :updatedAt',
      ReturnValues: 'ALL_NEW'
    }
    const result = await dynamoDb.update(params).promise()
    return result
  }

  static async query(url) {
    const params = {
      TableName: process.env.CHECKS_TABLE,
      IndexName: 'urlIndex',
      KeyConditionExpression: '#url = :url',
      ExpressionAttributeNames: {
        '#url': 'url'
      },
      ExpressionAttributeValues: {
        ':url': url
      },
      ScanIndexForward: false
    }
    const result = await dynamoDb.query(params).promise()
    return result
  }
}

module.exports = Checks
