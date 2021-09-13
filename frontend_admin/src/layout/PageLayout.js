import { useState, useEffect } from 'react';
import useWindowDimensions from '../hooks/useWindowDimentions';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import Header from './Header';
import Nav from './Nav';

const PageLayout = ({ children }) => {
  const [nav, setNav] = useState(true);
  const { width, breakpoint } = useWindowDimensions();

  const toggleNav = () => setNav(!nav);

  const navContainer = { maxWidth: width > 992 ? 280 : undefined }

  return (
    <Container fluid>
      <Row>
        <Header toggleNav={toggleNav} />
      </Row>
      <Row>
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
