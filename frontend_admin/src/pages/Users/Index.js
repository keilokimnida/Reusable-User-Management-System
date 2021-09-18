import { useState } from 'react';

import PageLayout from '../../layout/PageLayout';
import Button from 'react-bootstrap/Button';

import { toast } from 'react-toastify';

const Users = () => {
  const [count, setCount] = useState(0);

  const handleClick = () => {
    setCount(count + 1);
    toast.info("Privet!", {
      icon: "👋"
    });
  };

  return (
    <PageLayout>
      <h1>All Users</h1>
      <Button onClick={handleClick}>Summon Toast {count}</Button>
      <hr />
      <p>This is where you will see a table of users</p>
    </PageLayout>
  );
}

export default Users;
