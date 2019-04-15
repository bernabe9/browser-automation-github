const https = require('https')

const get = url =>
  new Promise((resolve, reject) => {
    https
      .get(url, resp => {
        resp.on('end', () => {
          resolve()
        })
      })
      .on('error', err => reject(err))
  })

module.exports = {
  get
}
