import React, { Fragment } from 'react'
import { Switch, Route } from 'react-router-dom'

import Home from './Home'
import Profile from './Profile'
import Nav from './Nav'

function App() {
  return (
    <Fragment>
      <Nav />
      <main className="body">
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/profile" component={Profile} />
        </Switch>
      </main>
    </Fragment>
  )
}

export default App
