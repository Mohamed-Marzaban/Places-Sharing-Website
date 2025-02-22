import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch
} from 'react-router-dom';

import { useCallback, useState } from 'react';

import Users from './user/pages/Users';
import NewPlace from './places/pages/NewPlace';
import MainNavigation from './shared/components/Navigation/MainNavigation';
import UserPlaces from './places/pages/UserPlaces';
import UpdatePlace from './places/pages/UpdatePlace';
import Authenticate from './user/pages/Authenticate'
import AuthContext from './shared/context/auth-context'
const App = () => {
  const [token, setToken] = useState(false)
  const [userId, setUserId] = useState(null)
  const login = useCallback((uid, token) => {
    setToken(token)
    setUserId(uid)
  }, [])
  const logout = useCallback(() => {
    setToken(null)
    setUserId(null)
  }, [])
  let routes;
  if (token)
    routes = (<Switch><Route path="/" exact>
      <Users />
    </Route>
      <Route path="/:userId/places" exact>
        <UserPlaces />
      </Route>
      <Route path="/places/new" exact>
        <NewPlace />
      </Route>
      <Route path="/places/:placeId" exact>
        <UpdatePlace />
      </Route>

      <Redirect to="/" />

    </Switch>)
  else
    routes = (
      <Switch>
        <Route path="/" exact>
          <Users />
        </Route>
        <Route path="/:userId/places" exact>
          <UserPlaces />
        </Route>
        <Route path='/auth' exact>
          <Authenticate />
        </Route>
        <Redirect to="/auth" />

      </Switch>
    )
  return (
    <AuthContext.Provider value={{ isLoggedIn: !!token, token: token, userId: userId, login: login, logout: logout }}>
      <Router>
        <MainNavigation />
        <main>

          {routes}
        </main>
      </Router>
    </AuthContext.Provider >

  );
};

export default App;
