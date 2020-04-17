import React, { Fragment } from 'react'
import { Switch, Route, useHistory } from 'react-router-dom'

import Home from './Home'
import Profile from './Profile'
import Nav from './Nav'

import Auth from './auth/Auth'

function App() {
  const history = useHistory()
  const auth = new Auth(history)

  return (
    <Fragment>
      <Nav />
      <main className="body">
        <Switch>
          <Route path="/" exact render={() => <Home auth={auth} />} />
          <Route path="/profile" component={Profile} />
        </Switch>
      </main>
    </Fragment>
  )
}

export default App
