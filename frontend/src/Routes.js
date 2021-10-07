import { Route, BrowserRouter as Router, Switch, Redirect } from 'react-router-dom';

import { getToken } from './utils/localStorage';

import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword/ForgotPassword';
import ChangePassword from './pages/ForgotPassword/ChangePassword';
import CreateAccount from './pages/CreateAccount';

import Home from './pages/Home';
import Account from './pages/Account';
import Users from './pages/Users/Index';
import ManagerUser from './pages/Users/User';

// this dummy is here so its more consistent
// anecdote: i forgot to return JSX in render={} and only called the component 
// as if it was a function and has lead to at least 2 hours being wasted
const dummy = (Component) => (props) => (<Component {...props} />);

const authGuard = (Component) => (props) => {
  let [token] = getToken();
  if (!token) return (<Redirect to="/login" {...props} />);
  return (<Component {...props} />);
}

const Routes = () => {
  return (
    <Router>
      <Switch>
        {/* Login */}
        <Route exact path="/login" render={props => dummy(Login)(props)} />

        {/* Forgot password */}
        <Route exact path="/forgot-password" render={props => dummy(ForgotPassword)(props)} />
        <Route path="/change-password/:username/:otp" render={(props) => dummy(ChangePassword)(props)} />
        <Route path="/create-account" render={(props) => dummy(CreateAccount)(props)} />

        {/* <Route path="/change-password/:username/:otp" render={(props) => <ChangePassword {...props} />} />
        <Route path="/create-account" render={(props) => <CreateAccount {...props} />} /> */}


        <Route exact path="/home" render={props => authGuard(Home)(props)} />
        <Route exact path="/" >
          <Redirect to="/home" />
        </Route>

        {/* User account settings */}
        <Route exact path="/me" render={props => authGuard(Account)(props)} />

        <Route exact path="/users" render={props => authGuard(Users)(props)} />
        <Route path="/users/:userId" render={props => authGuard(ManagerUser)(props)} />
      </Switch>
    </Router>
  );
}

export default Routes;
