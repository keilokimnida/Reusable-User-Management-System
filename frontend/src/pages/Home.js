import { useState } from 'react';

import PageLayout from '../layout/PageLayout';
import Button from 'react-bootstrap/Button';

import { toast } from 'react-toastify';

import APP_CONFIG from '../config/appConfig';
import axios from 'axios';

const Home = () => {
  const [count, setCount] = useState(0);

  const handleClick = () => {
    setCount(count + 1);
    toast.info("Privet!", {
      icon: "👋"
    });
  };

  const readCookie = async () => {
    try {
      const res = await axios.get(`${APP_CONFIG.baseUrl}/auth/read-cookie`, { withCredentials: true });
      toast.info(res.data);
      console.log(res.data);
    }
    catch (error) {
      console.error({ error });
    }
  };

  const dashboardItems = ["a", "b", "c", "d", "e", "f"];

  return (
    <PageLayout>
      {({ nav, setNav, toggleNav }) => (
        <div className="c-Home">
          <h1>User Management System</h1>
          <Button onClick={handleClick}>Summon Toast {count}</Button>
          <hr />

          <div className="c-Home__Dashboard">
            {/* Render dashboard items */}
            {dashboardItems.map(item => (
              <div className="c-Home__Dashboard-item c-Dashboard-item" key={item}>
                Dashboard item {item}
              </div>
            ))}
          </div>

          <hr />
          <h5>The nav is currently {nav ? "opened" : "closed"}</h5>
          <Button onClick={() => toggleNav()}>I can also now toggle the nav from inside PageLayout</Button>
          <Button variant="success" onClick={() => setNav(true)}>Force the nav to open</Button>
          <Button variant="danger" onClick={() => setNav(false)}>Force the nav to close</Button>

          <hr />
          <p>Sends a request to the backend with the refresh token cookie</p>
          <Button onClick={() => readCookie()}>Check refresh token HTTP only cookie</Button>

        </div>
      )}
    </PageLayout>
  );
}

export default Home;
