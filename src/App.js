import React, { useState, useEffect } from 'react';
import './App.css';

// components
import SignIn from './components/SignIn'
import About from './components/About'
import Tasks from './components/Tasks'
import Home from './components/Home'

import { Dialog, Classes, Tooltip, Button, AnchorButton, Intent } from '@blueprintjs/core'

import { authTokenIsStored, readUserProfile } from './utils/auth_utils'



import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect
} from "react-router-dom";



function App() {
  const [currentUser, setCurrentUser] = useState(undefined)


  const autoLogin = async () => {
    if (authTokenIsStored()) {
      console.log('logging in')
      let user = await readUserProfile()
      if (user) return setCurrentUser(user)
    }

  }


  useEffect(() => {
    autoLogin()
  }, [])

  const signOutHandler = (routeProps) => {
    setCurrentUser(undefined)
    localStorage.clear()
    routeProps.history.push('/')
  }


  const PrivateRoute = ({ children, ...rest }) => {
    return (
      <Route
        {...rest}
        render={({ location }) =>
          authTokenIsStored() ? (
            children
          ) : (
              <Redirect
                to={{
                  pathname: "/sign_in",
                  state: { from: location }
                }}
              />
            )
        }
      />
    );
  }

  console.log(currentUser)

  return (
    <Router>
      <Route
        render={routeProps => (
          <>
            <Link to="/">Home</Link>
            <Link to="/tasks">Tasks</Link>
            {currentUser ?
              <Link onClick={() => signOutHandler(routeProps)}>Sign Out</Link>
              :
              <SignIn autoLogin={() => autoLogin()} />
            }



          </>
        )}

      />
      <Switch>
        <Route exact path="/">
          <Home />
        </Route>

        <Route exact path="/sign_in">
          <SignIn autoLogin={() => autoLogin()} />
        </Route>

        <Route path="/about">
          <About />
        </Route>

        <PrivateRoute path="/tasks">
          <Tasks />
        </PrivateRoute>

      </Switch>
    </Router>
  );
}

export default App;
