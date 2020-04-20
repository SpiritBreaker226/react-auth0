import React, { useEffect, useState } from 'react'
import { Switch, Route, useHistory } from 'react-router-dom'

import Home from './Home'
import Profile from './Profile'
import Public from './Public'
import PrivateRoute from './PrivateRoute'
import Private from './Private'
import Courses from './Courses'
import Nav from './Nav'

import AuthContext from './AuthContext'

import Auth from './auth/Auth'
import Callback from './auth/Callback'

function App() {
  const history = useHistory()
  const auth = new Auth(history)
  const [tokenRenewalComplete, setTokenRenewalComplete] = useState(false)

  useEffect(() => {
    auth.renewToken(() => {
      setTokenRenewalComplete(true)
    })
  }, [auth])

  // Show loading message until the token renewal check is completed.
  if (!tokenRenewalComplete) return <span>Loading...</span>

  return (
    <AuthContext.Provider value={auth}>
      <Nav />
      <main className="body">
        <Switch>
          <Route path="/" exact render={() => <Home />} />
          <Route path="/public" component={Public} />
          <Route path="/callback" render={() => <Callback auth={auth} />} />
          <PrivateRoute path="/profile" component={Profile} />
          <PrivateRoute path="/private" component={Private} />
          <PrivateRoute
            path="/courses"
            component={Courses}
            scopes={['read:courses']}
          />
        </Switch>
      </main>
    </AuthContext.Provider>
  )
}

export default App
