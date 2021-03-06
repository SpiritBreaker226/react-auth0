import React from 'react'
import PropTypes from 'prop-types'

import { Route } from 'react-router-dom'

import AuthContext from './AuthContext'

const PrivateRoute = ({ component: Component, scopes, ...rest }) => {
  return (
    <AuthContext.Consumer>
      {(auth) => (
        <Route
          {...rest}
          render={() => {
            // 1. Redirect to login if not logged in.
            if (!auth.isAuthenticated()) return auth.login()

            // 2. Dsplay message if user lacks required scopes(s).
            if (scopes.length > 0 && !auth.userHasScopes(scopes)) {
              return (
                <h1>
                  Unauthorized - You need the following scopes(s) to veiw this
                  page: {scopes.join(',')}
                </h1>
              )
            }

            // 3. Render component
            return <Component auth={auth} />
          }}
        />
      )}
    </AuthContext.Consumer>
  )
}

PrivateRoute.propTypes = {
  component: PropTypes.func.isRequired,
  scopes: PropTypes.array,
}

PrivateRoute.defaultProps = {
  scopes: [],
}

export default PrivateRoute
