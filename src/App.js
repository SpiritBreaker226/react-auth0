import React, { Fragment } from 'react'
import { Switch, Route, useHistory, Redirect } from 'react-router-dom'

import Home from './Home'
import Profile from './Profile'
import Public from './Public'
import Private from './Private'
import Nav from './Nav'

import Auth from './auth/Auth'
import Callback from './auth/Callback'

function App() {
  const history = useHistory()
  const auth = new Auth(history)

  return (
    <Fragment>
      <Nav auth={auth} />
      <main className="body">
        <Switch>
          <Route path="/" exact render={() => <Home auth={auth} />} />
          <Route
            path="/profile"
            render={() =>
              auth.isAuthenticated() ? (
                <Profile auth={auth} />
              ) : (
                <Redirect to="/" />
              )
            }
          />
          <Route path="/public" component={Public} />
          <Route
            path="/private"
            render={() =>
              auth.isAuthenticated() ? <Private auth={auth} /> : auth.login()
            }
          />
          <Route path="/callback" render={() => <Callback auth={auth} />} />
        </Switch>
      </main>
    </Fragment>
  )
}

export default App
