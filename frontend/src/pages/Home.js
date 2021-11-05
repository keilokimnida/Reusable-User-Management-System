import { useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import { toast } from 'react-toastify';

import PageLayout from '../layout/PageLayout';
import APP_CONFIG from '../config/appConfig';
import useWatchLoginStatus from '../hooks/useWatchLoginStatus';


const Home = ({TokenManager}) => {
  useWatchLoginStatus();

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
    <PageLayout title = "Home">
      {({ nav, setNav, toggleNav }) => (
        <div className="c-Home">
          <h1>User Management System</h1>
          <hr />
{/* 
          <div className="c-Home__Dashboard">
            {/* Render dashboard items *
            {dashboardItems.map(item => (
              <div className="c-Home__Dashboard-item c-Dashboard-item" key={item}>
                Dashboard item {item}
              </div>
            ))}
          </div> 

          <hr />
          */}
          <p>Sends a request to the backend with the refresh token cookie</p>
          <Button onClick={() => readCookie()}>Check refresh token HTTP only cookie</Button>

        </div>
      )}
    </PageLayout>
  );
};

export default Home;
