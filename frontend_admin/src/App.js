// error boundary
import { ErrorBoundary } from 'react-error-boundary';
import Fallback from './components/Fallback';

// routes
import Routes from './Routes';

// toast notification container
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

// bootstrap styling
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';

const App = () => {
  return (
    <>
      {/* The toast container is here so it is present through all interfaces */}
      <ToastContainer
        position="bottom-left"
        autoClose={5000}
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
    </>
  );
}

export default App;
