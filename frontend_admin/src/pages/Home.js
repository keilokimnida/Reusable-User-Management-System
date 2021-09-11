import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import { toast } from 'react-toastify';

const Home = () => {
  const [count, setCount] = useState(0);

  const handleClick = () => {
    setCount(count + 1);
    toast.info("Privet!")
  };

  return (
    <Container className="my-4">
      <h1>User Management System</h1>
      <Button onClick={handleClick}>Summon Toast {count}</Button>
    </Container>
  );
}

export default Home;
