import Spinner from 'react-bootstrap/Spinner';
import styles from './Loading.module.css';

const Loading = () => (
  <div className={styles.container}>
    <Spinner animation="border" />
  </div>
);

export default Loading;
