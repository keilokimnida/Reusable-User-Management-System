import { useState } from 'react';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import styles from './PageLayout.module.css';
import Header from './Header';
import Nav from './Nav';
import Footer from './Footer';

const PageLayout = ({ children }) => {
  const [nav, setNav] = useState(window.innerWidth < 992 ? false : true);

  const toggleNav = () => setNav(!nav);

  return (
    <Container fluid className={styles.windowContainer}>
      <Row>
        <Header toggleNav={toggleNav} />
      </Row>

      <Row className={styles.viewContainer}>
        <Col className={`p-0 ${nav ? "d-block" : "d-none"} ${styles.navContainer}`}>
          <Nav setNav={setNav} />
        </Col>

        <Col as="main" className={`p-0 ${!nav || "d-none"} d-lg-block ${styles.mainContainer}`}>
          <div className="p-3">{children}</div>
          <Footer />
        </Col>
      </Row>
    </Container >
  );
}

export default PageLayout;
