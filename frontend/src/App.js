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

const stripePKTest = STRIPE_CONFIG.stripePKTest;
const promise = loadStripe(stripePKTest);

const App = () => {
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
        <Routes />
      </ErrorBoundary>
    </Elements>
  );
}

export default App;
