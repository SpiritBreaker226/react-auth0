import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

const Callback = ({ auth }) => {
  const location = useLocation()
  const [pageStatus, setPageStatus] = useState('Loading...')

  useEffect(() => {
    // Handle authentication if expected values are in the URL
    if (/access_token|id_token|error/.test(location.hash)) {
      auth.handleAuthentication()
      return
    }

    setPageStatus('Invalid callback URL.')
  }, [auth, location.hash])

  return <h1>{pageStatus}</h1>
}

export default Callback
