import styles from './Error.module.css';
import { ExclamationSquare } from 'react-bootstrap-icons';

const Error = ({ error }) => (
  <div className={styles.container}>
    <ExclamationSquare size={36} />
    <p className="text-center">An error has occured</p>
  </div>
);

export default Error;
