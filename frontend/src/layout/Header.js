import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Avatar from './Avatar';
import { List } from 'react-bootstrap-icons'

const Header = ({ toggleNav }) => {
  return (
    <Container
      fluid
      as="header"
      className="c-Header"
    >
      <div className="c-Header__Left">
        <Button
          onClick={() => toggleNav()}
        >
          <List size={25} />
        </Button>
        <div className="c-Header__Title">
          <h2>User Management System</h2>
        </div>
      </div>
      
      <div className="c-Header__Avatar">
        <Avatar />
      </div>
    </Container>
  );
}

export default Header;
