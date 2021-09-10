import { Route, BrowserRouter as Router, Switch, Redirect } from 'react-router-dom';

import Login from './pages/Login';
import Home from './pages/Home';

import { getToken } from './utils/token';

const authGuard = (Component) => (props) => {
  let token = getToken();
  if (!token) return (<Redirect to="/login" {...props} />);
  return (<Component {...props} />);
}

const Routes = () => {
  return (
    <Router>
      <Switch>
        {/* Login */}
        <Route path="/login" render={(props) => Login(props)} />

        <Route path="/" render={(props) => authGuard(Home)(props)} />
      </Switch>
    </Router>
  );
}

export default Routes;
