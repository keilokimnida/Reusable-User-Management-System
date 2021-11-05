// Refresh token
import React, { useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';
import APP_CONFIG from './config/appConfig';
import tokenManager from './utils/tokenManager';

// error boundary
import { ErrorBoundary } from 'react-error-boundary';
import Fallback from './components/Fallback';

// routes
import Routes from './Routes';

// toast notification container
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import TOAST_CONFIG from './config/toastConfig';

// styling
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';

// Stripe elements
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import STRIPE_CONFIG from './config/stripeConfig';
import Loading from './components/Loading';

const stripePKTest = STRIPE_CONFIG.stripePKTest;
const promise = loadStripe(stripePKTest);

const App = () => {
  const [loading, setLoading] = useState(null);

  const TokenManager = tokenManager();
  

  const verifyUser = useCallback(async () => {
    setLoading(true);
    await getRefreshToken();
    setLoading(false);
  }, []);

  const getRefreshToken = async () => {
    try {
      const res = await axios.post(`${APP_CONFIG.baseUrl}/auth/refresh`, {}, { withCredentials: true })
      if (res.status === 200) {
        const accessToken = res.data.results.access_token;
        TokenManager.setToken(accessToken);
        axios.defaults.headers.common = {'Authorization': `bearer ${accessToken}`};
        // call refreshToken every 3 minutes to renew the authentication token.
        TokenManager.setTimeout(verifyUser, 3 * 60 * 1000);
      } else {
        TokenManager.setToken(null);
      }
    } catch (error) {
      TokenManager.setMessage(error.response?.data.message);
    }
  };

  useEffect(() => {
    verifyUser();
  }, []);

  return (
    // Elements is here so that every React page can use Stripe elements
    <Elements stripe={promise}>
      {/* The toast container is here so it is present through all interfaces */}
      <ToastContainer
        position="bottom-left"
        autoClose={TOAST_CONFIG.duration.normal}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <ErrorBoundary fallbackRender={Fallback}>
        {
          loading ?
          <Loading /> :
          <Routes TokenManager={TokenManager}/>
        }
      </ErrorBoundary>
    </Elements>
  );
};

export default App;
