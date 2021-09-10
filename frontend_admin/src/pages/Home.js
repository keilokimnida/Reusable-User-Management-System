import { Container, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';

const Home = () => {
  const handleClick = () => toast.info("Privet!");

  return (
    <Container>
      <h1>User Management System</h1>
      <Button onClick={handleClick}>Summon Toast</Button>
    </Container>
  );
}

export default Home;
