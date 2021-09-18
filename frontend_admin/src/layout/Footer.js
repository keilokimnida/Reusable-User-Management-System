import Container from 'react-bootstrap/Container';

import styles from './Footer.module.css';

const Footer = () => {
  return (
    <Container fluid as="footer" className={`p-3 bg-primary text-white ${styles.footer}`}>
      <h4>User Management System</h4>
      <p>Reusable user management system</p>
    </Container>
  );
}

export default Footer;
