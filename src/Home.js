import React from 'react'

const Home = ({ auth }) => {
  return (
    <section>
      <h1>Home</h1>

      <button onClick={auth.login}>Log In</button>
    </section>
  )
}

export default Home
