import React from 'react'
import PropTypes from 'prop-types'

import { Route } from 'react-router-dom'

const PrivateRoute = ({ component: Component, auth, scopes, ...rest }) => {
  return (
    <Route
      {...rest}
      render={() => {
        // 1. Redirect to login if not logged in.
        if (!auth.isAuthenticated()) return auth.login()

        // 2. Dsplay message if user lacks required scopes(s).
        if (scopes.length > 0 && !auth.userHasScopes(scopes)) {
          return (
            <h1>
              Unauthorized - You need the following scopes(s) to veiw this page:{' '}
              {scopes.join(',')}
            </h1>
          )
        }

        // 3. Render component
        return <Component auth={auth} />
      }}
    />
  )
}

PrivateRoute.propTypes = {
  component: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  scopes: PropTypes.array,
}

PrivateRoute.defaultProps = {
  scopes: [],
}

export default PrivateRoute
