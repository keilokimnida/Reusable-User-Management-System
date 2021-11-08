import { Route, BrowserRouter as Router, Switch, Redirect } from 'react-router-dom';

import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword/ForgotPassword';
import ChangePassword from './pages/ForgotPassword/ChangePassword';
import CreateAccount from './pages/CreateAccount';

import ManageUsers from './pages/Users/ManageUsers';
import ManagerUser from './pages/Users/ManageUser';

import Checkout from './pages/Checkout';
import ChangePlan from './pages/ChangePlan';
import Plans from './pages/Plans';

import Account from './pages/Account';
import Home from './pages/Home';
import LoggedOut from './pages/LoggedOut';

import TokenManager from './utils/tokenManager';

const Routes = () => {
  // this dummy is here so its more consistent
  // anecdote: i forgot to return JSX in render={} and only called the component 
  // as if it was a function and has lead to at least 2 hours being wasted
  const dummy = (Component) => (props) => (<Component {...props} />);

  const authGuard = (Component) => (props) => {
    const token = TokenManager.getToken();
    if (!token) return (<Redirect to="/logged-out" {...props} />);
    return (<Component {...props} />);
  };

  return (
    <Router>
      <Switch>
        {/* Login */}
        <Route exact path="/login" render={props => dummy(Login)(props)} />

        {/* Forgot password */}
        <Route exact path="/forgot-password" render={props => dummy(ForgotPassword)(props)} />
        <Route path="/change-password/:token" render={(props) => dummy(ChangePassword)(props)} />
        <Route path="/create-account" render={(props) => dummy(CreateAccount)(props)} />

        {/* <Route path="/change-password/:username/:otp" render={(props) => <ChangePassword {...props} />} />
        <Route path="/create-account" render={(props) => <CreateAccount {...props} />} /> */}

        {/* Home */}
        <Route exact path="/home" render={props => authGuard(Home)(props)} />
        <Route exact path="/" >
          <Redirect to="/home" />
        </Route>

        {/* Plans */}
        <Route exact path="/plans" render={(props) => dummy(Plans)(props)} />
        <Route path="/plans/payment/:type" render={(props) => authGuard(Checkout)(props)} />
        <Route path="/plans/change" render={(props) => authGuard(ChangePlan)(props)} />

        {/* User account settings */}
        <Route exact path="/me" render={props => authGuard(Account)(props)} />

        <Route exact path="/users" render={props => authGuard(ManageUsers)(props)} />
        <Route path="/users/:userId" render={props => authGuard(ManagerUser)(props)} />

        <Route path="/logged-out" render={(props) => dummy(LoggedOut)(props)} />
      </Switch>
    </Router>
  );
}

export default Routes;
