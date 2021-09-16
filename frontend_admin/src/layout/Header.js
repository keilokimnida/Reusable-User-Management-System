import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Avatar from './Avatar';
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
        className="h-100"
        onClick={() => toggleNav()}
      >
        <List size={32} />
      </Button>
      <div className={`d-none d-md-block ${styles.titleContainer}`}>
        <h2 className="m-0">User Management System</h2>
      </div>
      <div className={styles.avatarContainer}>
        <Avatar />
      </div>
    </Container>
  );
}

export default Header;
