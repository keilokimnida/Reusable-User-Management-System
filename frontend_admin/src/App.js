import { ErrorBoundary } from 'react-error-boundary';
import Fallback from './components/Fallback';
import Routes from './Routes';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';

const App = () => {
  return (
    <ErrorBoundary fallbackRender={Fallback}>
      <Routes />
    </ErrorBoundary>
  );
}

export default App;
