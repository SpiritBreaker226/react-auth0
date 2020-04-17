import auth0 from 'auth0-js'

export default class Auth {
  constructor(history) {
    this.userProfile = null

    this.history = history
    this.auth0 = new auth0.WebAuth({
      domain: process.env.REACT_APP_AUTH0_DOMAIN,
      clientID: process.env.REACT_APP_AUTH0_CLIENTID,
      redirectUri: process.env.REACT_APP_AUTH0_CALLBACK_URL,
      // token is the access token id_token is the identity token
      responseType: 'token id_token',
      scope: 'openid profile email',
    })
  }

  login = () => {
    // redirects to the auth0 login page
    this.auth0.authorize()
  }

  handleAuthentication = () => {
    this.auth0.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        // set the session
        this.setSession(authResult)
        this.history.push('/')
      } else if (err) {
        // display error message if login has one
        this.history.push('/')
        alert(`Error ${err.error}. Check the console for further details.`)
        console.warn(err)
      }
    })
  }

  setSession = (authResult) => {
    // set the time that the access token will expire
    const expiresAt = JSON.stringify(
      authResult.expiresIn * 1000 + new Date().getTime()
    )

    // not requirmend but for the couse they are using localStorge for now
    localStorage.setItem('access_token', authResult.accessToken)
    localStorage.setItem('id_token', authResult.idToken)
    localStorage.setItem('expires_at', expiresAt)
  }

  isAuthenticated() {
    const expiresAt = JSON.parse(localStorage.getItem('expires_at'))

    return new Date().getTime() < expiresAt
  }

  logout = () => {
    // user out from the local computer
    // (soft logout if you wnat to manage mutiple clients)
    localStorage.removeItem('access_token')
    localStorage.removeItem('id_token')
    localStorage.removeItem('expires_at')
    this.userProfile = null

    // logout the user from auth0
    this.auth0.logout({
      clientID: process.env.REACT_APP_AUTH0_CLIENTID,
      returnTo: 'http://localhost:3000',
    })
  }

  getAccessToken = () => {
    const accessToken = localStorage.getItem('access_token')

    if (!accessToken) {
      throw new Error('No access token found.')
    }

    return accessToken
  }

  getProfile = (cb) => {
    if (this.useProfile) return cb(this.userProfile)

    this.auth0.client.userInfo(this.getAccessToken(), (err, profile) => {
      if (profile) this.userProfile = profile

      cb(profile, err)
    })
  }
}
