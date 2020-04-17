import auth0 from 'auth0-js'

export default class Auth {
  constructor(history) {
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
      } else if (err) {
        // display error message if login has one
        this.history.push('/')
        alert(`Error ${err.error}. Check the console for further details.`)
        console.warn(err)
      }
    })
  }
}
