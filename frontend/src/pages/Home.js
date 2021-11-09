import { useState, useEffect } from 'react';
import axios from 'axios';
import HomeBentoBox from "../components/HomeBentoBox";
import { NavLink } from "react-router-dom";
import PageLayout from '../layout/PageLayout';
import APP_CONFIG from '../config/appConfig';
import useWatchLoginStatus from '../hooks/useWatchLoginStatus';

const Home = () => {
  useWatchLoginStatus();

  // State declarations
  const [exclusiveContent, setExclusiveContent] = useState({
    all: null,
    standard: null,
    premium: null
  });

  useEffect(() => {
    let componentMounted = true;
    (async () => {
      try {
        // Get exclusive content, access: all
        const res = await axios.get(`${APP_CONFIG.baseUrl}/exclusive-contents/all`);
        console.log(res);
        const exclusiveContent = res.data.results;
        if (componentMounted) {
          if (exclusiveContent?.length > 0) {
            setExclusiveContent((prevState) => ({
              ...prevState,
              all: exclusiveContent[0]
            }));
          }
        }
      } catch (error) {
        console.log(error);
      }

      try {
        // Get exclusive content, access: Premium, standard, free trial users only
        const res = await axios.get(`${APP_CONFIG.baseUrl}/exclusive-contents/standard`);

        if (componentMounted) {

          const exclusiveContent = res.data.results;
          if (exclusiveContent?.length > 0) {

            setExclusiveContent((prevState) => ({
              ...prevState,
              standard: exclusiveContent[0]
            }));
          }
        }
      } catch (error) {
        console.log(error);
      }

      try {
        // Get exclusive content, access: Premium and free trial users only
        const res = await axios.get(`${APP_CONFIG.baseUrl}/exclusive-contents/premium`);

        if (componentMounted) {
          const exclusiveContent = res.data.results;
          if (exclusiveContent?.length > 0) {
            setExclusiveContent((prevState) => ({
              ...prevState,
              premium: exclusiveContent[0]
            }));
          }
        }
      } catch (error) {
        console.log(error);
      }
    })();

    return (() => {
      componentMounted = false;
    });

  }, []);

  // const readCookie = async () => {
  //   try {
  //     const res = await axios.get(`${APP_CONFIG.baseUrl}/auth/read-cookie`);
  //     toast.info(res.data);
  //     console.log(res.data);
  //   }
  //   catch (error) {
  //     console.error({ error });
  //   }
  // };

  return (
    <PageLayout title="Home">
      <div className="c-Home">
        {/* Subscription visibility demo */}
        <div className="c-Home__Subscription">
          <h1>Test your subscription here</h1>
          <p>The higher your subscription level, the more content you will be able to see</p>
          <NavLink to="/me" >Manage Subscription</NavLink>
          <div className="c-Home__Subscription-legend c-Subscription-legend">
            <h2>Visibility</h2>
            <ul>
              <li>
                <span className="c-Subscription-legend__All"></span>
                <p>All Users</p>
              </li>
              <li>
                <span className="c-Subscription-legend__Standard"></span>
                <p>Standard, Premium and Free Trial Users only</p>
              </li>
              <li>
                <span className="c-Subscription-legend__Premium"></span>
                <p>Premium and Free trial users only</p>
              </li>
            </ul>
          </div>
          <div className="c-Home__Bento-boxes">
            <HomeBentoBox content={exclusiveContent.all?.content} heading="All users" variation={1} />
            <HomeBentoBox content={exclusiveContent.standard?.content} variation={2} />
            <HomeBentoBox content={exclusiveContent.premium?.content} variation={3} />
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Home;
