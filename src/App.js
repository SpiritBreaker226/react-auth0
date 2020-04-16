import React from 'react'
import { Switch, Route } from 'react-router-dom'

import Home from './Home'
import Profile from './Profile'

function App() {
  return (
    <main className="body">
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/profile" component={Profile} />
      </Switch>
    </main>
  )
}

export default App
