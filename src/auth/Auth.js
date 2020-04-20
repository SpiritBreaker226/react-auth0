import auth0 from 'auth0-js'

const REDIRECT_ON_LOGIN = 'redirect_on_login'

// Stored outside class since private
let _accessToken = null
let _scopes = null
let _expiresAt = null

export default class Auth {
  constructor(history) {
    this.userProfile = null
    this.requestedScopes = 'openid profile email read:courses'

    this.history = history
    this.auth0 = new auth0.WebAuth({
      domain: process.env.REACT_APP_AUTH0_DOMAIN,
      clientID: process.env.REACT_APP_AUTH0_CLIENTID,
      redirectUri: process.env.REACT_APP_AUTH0_CALLBACK_URL,
      audience: process.env.REACT_APP_AUTH0_AUDIENCE,
      // token is the access token id_token is the identity token
      responseType: 'token id_token',
      scope: this.requestedScopes,
    })
  }

  login = () => {
    localStorage.setItem(
      REDIRECT_ON_LOGIN,
      JSON.stringify(this.history.location)
    )

    // redirects to the auth0 login page
    this.auth0.authorize()
  }

  handleAuthentication = () => {
    this.auth0.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        // set the session
        this.setSession(authResult)

        const redirectLocation = localStorage.getItem(REDIRECT_ON_LOGIN)
          ? JSON.parse(localStorage.getItem(REDIRECT_ON_LOGIN))
          : '/'

        this.history.push(redirectLocation)
      } else if (err) {
        // display error message if login has one
        this.history.push('/')
        alert(`Error ${err.error}. Check the console for further details.`)
        console.warn(err)
      }

      localStorage.removeItem(REDIRECT_ON_LOGIN)
    })
  }

  setSession = (authResult) => {
    // set the time that the access token will expire
    _expiresAt = authResult.expiresIn * 1000 + new Date().getTime()

    // If there is a value on the `scope` param from the authResult,
    // use it to set scopes in the session for the user. Otherwise
    // use the scopes as requested. If no scopes were requested,
    // set it to nothing
    _scopes = authResult.scope || this.requestedScopes || ''

    _accessToken = authResult.accessToken

    this.scheduleTokenRenews()
  }

  isAuthenticated() {
    return new Date().getTime() < _expiresAt
  }

  logout = () => {
    // logout the user from auth0
    this.auth0.logout({
      clientID: process.env.REACT_APP_AUTH0_CLIENTID,
      returnTo: 'http://localhost:3000',
    })
  }

  getAccessToken = () => {
    if (!_accessToken) {
      throw new Error('No access token found.')
    }

    return _accessToken
  }

  getProfile = (cb) => {
    if (this.useProfile) return cb(this.userProfile)

    this.auth0.client.userInfo(this.getAccessToken(), (err, profile) => {
      if (profile) this.userProfile = profile

      cb(profile, err)
    })
  }

  userHasScopes(scopes) {
    const grantedScopes = _scopes || ''

    return scopes.every((scope) => grantedScopes.includes(scope))
  }

  renewToken(cb) {
    this.auth0.checkSession({}, (err, result) => {
      if (err) {
        console.warn(`Error: ${err.error} - ${err.errorDescription}`)
      } else {
        this.setSession(result)
      }

      if (cb) cb(err, result)
    })
  }

  scheduleTokenRenews() {
    const delay = _expiresAt - Date.now()

    if (delay > 0) {
      setTimeout(() => {
        this.renewToken()
      }, delay)
    }
  }
}
