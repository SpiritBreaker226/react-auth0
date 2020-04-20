const express = require('express')
const jwt = require('express-jwt') // validate JWT and set req.user
const jwksRsa = require('jwks-rsa') // Retrieve RSA keys from a JSON Web Key set (JWKS) enpoint
const checkScope = require('express-jwt-authz') // Validate JWT scopes

require('dotenv').config()

const checkJwt = jwt({
  // Dynamically provide a signing key based on the kid in the header
  // and the signing keys provided by the JWKs endpoint
  secret: jwksRsa.expressJwtSecret({
    cache: true, // cache the signing key
    rateLimit: true,
    jwksRequestPerMinute: 5, // prevent attackers from requesting more than 5 per minute
    jwksUri: `https://${process.env.REACT_APP_AUTH0_DOMAIN}/.well-known/jwks.json`,
  }),
  // Validate the audience and the issuer.
  audience: process.env.REACT_APP_AUTH0_AUDIENCE,
  issuer: `https://${process.env.REACT_APP_AUTH0_DOMAIN}/`,
})

const app = express()

function checkRole(role) {
  return (req, res, next) => {
    const assignedRoles = req.user[process.env.REACT_APP_AUTH0_RULES]

    if (Array.isArray(assignedRoles) && assignedRoles.includes(role)) {
      return next()
    }

    return res.status(401).send('Insufficient role')
  }
}

app.get('/public', (req, res) => {
  res.json({
    message: 'Hello from a public API',
  })
})

app.get('/admin', checkJwt, checkRole('admin'), (req, res) => {
  res.json({
    message: 'Hello from a admin API',
  })
})

app.get('/courses', checkJwt, checkScope(['read:courses']), (req, res) => {
  res.json({
    courses: [
      // NOTE: In the real word, it would read the sub (subscriber ID) from the
      // access token and use it to query the database for the author's courses
      // i.e. the IDs would use UUID
      { id: 1, title: 'Building Apps with React and Redux' },
      { id: 2, title: 'Creating Reusable React Components' },
    ],
  })
})

app.listen(process.env.REACT_APP_EXPRESS_PORT, () => {
  console.log(
    'API server is listening on',
    process.env.REACT_APP_AUTH0_AUDIENCE
  )
})
