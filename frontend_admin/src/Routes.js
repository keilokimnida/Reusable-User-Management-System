import { Route, BrowserRouter as Router, Switch, Redirect } from 'react-router-dom';

import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import Home from './pages/Home';

import { getToken } from './utils/localStorage';

// this dummy is here so its more consistent
// anecdote: i forgot to return JSX in render={} and only called the component 
// as if it was a function and has lead to at least 2 hours being wasted
const dummy = (Component) => (props) => (<Component {...props} />);

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
        <Route path="/login" render={(props) => dummy(Login)(props)} />

        {/* Forgot Password */}
        <Route path="/forgot-password" render={(props) => dummy(ForgotPassword)(props)} />

        <Route path="/" render={(props) => authGuard(Home)(props)} />
      </Switch>
    </Router>
  );
}

export default Routes;
