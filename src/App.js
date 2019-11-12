import React, { useState, useEffect } from 'react';

// styles
import './App.css';

// components
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
import NavBar from './components/NavBar';



function App() {
  const [currentUser, setCurrentUser] = useState(undefined)


  const autoLogin = async () => {
    if (authTokenIsStored()) {

      let user = await readUserProfile()
      if (user) return setCurrentUser(user)
    }

  }


  useEffect(() => {
    console.log('auto login')
    autoLogin()
  }, [])





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


  return (
    <Router>
      <Route render={routeProps => <NavBar {...routeProps} currentUser={currentUser} autoLogin={autoLogin} setCurrentUser={setCurrentUser} />} />
      <div style={{ margin: '1rem' }}>
        <Switch>
          <Route exact path="/">
            <Home />
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
