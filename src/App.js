import React, { Fragment } from 'react'
import { Switch, Route, useHistory } from 'react-router-dom'

import Home from './Home'
import Profile from './Profile'
import Public from './Public'
import PrivateRoute from './PrivateRoute'
import Private from './Private'
import Courses from './Courses'
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
          <Route path="/public" component={Public} />
          <Route path="/callback" render={() => <Callback auth={auth} />} />
          <PrivateRoute path="/profile" auth={auth} component={Profile} />
          <PrivateRoute path="/private" auth={auth} component={Private} />
          <PrivateRoute
            path="/courses"
            component={Courses}
            auth={auth}
            scopes={['read:courses']}
          />
        </Switch>
      </main>
    </Fragment>
  )
}

export default App
