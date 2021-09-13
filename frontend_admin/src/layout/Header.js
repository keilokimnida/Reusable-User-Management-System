import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import { List } from 'react-bootstrap-icons'

const Header = ({ toggleNav }) => {
  return (
    <Container
      fluid
      as="header"
      className="px-3 py-2 shadow-sm d-flex align-items-center"
      style={{ gap: 12 }}
    >
      <Button
        size="lg"
        className="h-100"
        onClick={() => toggleNav()}
      >
        <List size={24} />
      </Button>
      <h2 className="m-0">User Management System</h2>
    </Container>
  );
}

export default Header;
