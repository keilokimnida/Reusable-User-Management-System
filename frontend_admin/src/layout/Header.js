import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import { List } from 'react-bootstrap-icons'

import styles from './Header.module.css';

const Header = ({ toggleNav }) => {
  return (
    <Container
      fluid
      as="header"
      className={`px-3 py-2 shadow-sm ${styles.container}`}
    >
      <Button
        size="lg"
        className="h-100"
        onClick={() => toggleNav()}
      >
        <List size={24} />
      </Button>
      <div className={styles.title}>
        <h2 className="m-0">User Management System</h2>
      </div>
    </Container>
  );
}

export default Header;
