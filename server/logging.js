const redis = require('redis')
const onFinished = require('on-finished')

const URLFormat = /^\/((?:@[^\/@]+\/)?[^\/@]+)(?:@([^\/]+))?(\/.*)?$/

const logPackageRequests = (redisURL) => {
  const redisClient = redis.createClient(redisURL)

  return (req, res, next) => {
    onFinished(res, () => {
      const path = req.path

      if (res.statusCode === 200 && path.charAt(path.length - 1) !== '/') {
        //redisClient.zincrby([ 'request-paths', 1, path ])

        const match = URLFormat.exec(path)

        if (match) {
          const packageName = match[1]
          redisClient.zincrby([ 'package-requests', 1, packageName ])
        }
      }
    })

    next()
  }
}

module.exports = {
  logPackageRequests
}
