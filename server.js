const express = require('express')
const jwt = require('express-jwt') // validate JWT and set req.user
const jwksRsa = require('jwks-rsa') // Retrieve RSA keys from a JSON Web Key set (JWKS) enpoint

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

app.get('/public', (req, res) => {
  res.json({
    message: 'Hello from a public API',
  })
})

app.get('/private', checkJwt, (req, res) => {
  res.json({
    message: 'Hello from a private API',
  })
})

app.listen(process.env.REACT_APP_EXPRESS_PORT, () => {
  console.log(
    'API server is listening on',
    process.env.REACT_APP_AUTH0_AUDIENCE
  )
})
