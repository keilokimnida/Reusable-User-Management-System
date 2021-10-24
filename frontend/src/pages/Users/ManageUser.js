import { useState } from 'react';
import { useParams } from 'react-router';

import PageLayout from '../../layout/PageLayout';
import Button from 'react-bootstrap/Button';

import { toast } from 'react-toastify';

const ManageUser = () => {
  const { userId } = useParams();
  const [count, setCount] = useState(0);

  const handleClick = () => {
    setCount(count + 1);
    toast.info("Privet!", {
      icon: "👋"
    });
  };

  return (
    <PageLayout title = "Manage User">
      <h1>User ID {userId}</h1>
      <Button onClick={handleClick}>Summon Toast {count}</Button>
      <hr />
      <p>This is where you will be managing a user</p>
    </PageLayout>
  );
}

export default ManageUser;
