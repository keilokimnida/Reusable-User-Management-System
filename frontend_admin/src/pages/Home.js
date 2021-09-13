import { useState } from 'react';

import PageLayout from '../layout/PageLayout';
import Button from 'react-bootstrap/Button';

import { toast } from 'react-toastify';

const Home = () => {
  const [count, setCount] = useState(0);

  const handleClick = () => {
    setCount(count + 1);
    toast.info("Privet!")
  };

  return (
    <PageLayout>
      <h1> User Management System</h1>
      <Button onClick={handleClick}>Summon Toast {count}</Button>
    </PageLayout>
  );
}

export default Home;
