import React, { useState, useEffect } from 'react';

// styles
import './App.css';
import { Navbar, Alignment, AnchorButton, Button } from '@blueprintjs/core'

// components
import SignIn from './components/SignIn'
import About from './components/About'
import Tasks from './components/Tasks'
import Home from './components/Home'

// utils
import { authTokenIsStored, readUserProfile } from './utils/auth_utils'

// router
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
                  pathname: "/",
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
          <Navbar>
            <Navbar.Group align={Alignment.LEFT}>
              <Link className="bp3-button bp3-minimal" to="/" >Home</Link>
              {currentUser ? <Link className="bp3-button bp3-minimal" to="/tasks">Tasks</Link> : null}

            </Navbar.Group>
            <Navbar.Group align={Alignment.RIGHT}>
              <Navbar.Divider />
              {currentUser ? <Button minimal onClick={() => signOutHandler(routeProps)}>Sign Out</Button>
                :
                <SignIn autoLogin={() => autoLogin()} />
              }
            </Navbar.Group>
          </Navbar>
        )}

      />
      <div style={{ margin: '1rem' }}>
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>

          <Route path="/about">
            <About />
          </Route>

          <PrivateRoute path="/tasks">
            <Tasks />
          </PrivateRoute>

        </Switch>
      </div>
    </Router>
  );
}

export default App;
