import { useState } from 'react';

import PageLayout from '../layout/PageLayout';
import Button from 'react-bootstrap/Button';

import { toast } from 'react-toastify';

import styles from './Home.module.css';

const Home = () => {
  const [count, setCount] = useState(0);

  const handleClick = () => {
    setCount(count + 1);
    toast.info("Privet!", {
      icon: "👋"
    });
  };

  const dashboardItems = ["a", "b", "c", "d", "e", "f"];

  return (
    <PageLayout>
      {({ nav, setNav, toggleNav }) => (
        <>
          <h1>User Management System</h1>
          <Button onClick={handleClick}>Summon Toast {count}</Button>
          <hr />

          <div className={styles.dashboardContainer}>
            {dashboardItems.map(item => (
              <div className={styles.dashboardItem} key={item}>
                Dashboard item {item}
              </div>
            ))}
          </div>

          <hr />
          <h5>The nav is currently {nav ? "opened" : "closed"}</h5>
          <Button onClick={() => toggleNav()}>I can also now toggle the nav from inside PageLayout</Button>
          <Button variant="success" onClick={() => setNav(true)}>Force the nav to open</Button>
          <Button variant="danger" onClick={() => setNav(false)}>Force the nav to close</Button>
        </>
      )}
    </PageLayout>
  );
}

export default Home;
