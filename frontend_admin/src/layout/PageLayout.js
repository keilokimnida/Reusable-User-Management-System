import { useState, useEffect } from 'react';
import useWindowDimensions from '../hooks/useWindowDimensions';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import styles from './PageLayout.module.css';
import Header from './Header';
import Nav from './Nav';

const PageLayout = ({ children }) => {
  const { width } = useWindowDimensions();
  const [nav, setNav] = useState(width < 992 ? false : true);

  const toggleNav = () => setNav(!nav);

  const navContainer = { maxWidth: width < 992 ? undefined : 280 }

  return (
    <Container fluid className={styles.windowContainer}>
      <Row>
        <Header toggleNav={toggleNav} />
      </Row>
      <Row className={styles.viewContainer}>
        <Col className={`p-0 ${nav ? "d-block" : "d-none"}`} style={navContainer}>
          <Nav />
        </Col>
        <Col as="main" className={`p-3 ${!nav || "d-none"} d-lg-block`}>
          {children}
        </Col>
      </Row>
    </Container >
  );
}

export default PageLayout;
