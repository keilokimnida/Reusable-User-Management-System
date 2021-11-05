import { useState } from 'react';

import BREAKPOINTS from '../config/breakpoints';

import Header from './Header';
import Nav from './Nav';
import Footer from './Footer';
import Title from './Title';

const PageLayout = ({ children, title, TokenManager }) => {
  const [nav, setNav] = useState(window.innerWidth < BREAKPOINTS.lg ? false : true);
  const toggleNav = () => setNav(!nav);
  return (
    <div className="l-Main">
      <Header toggleNav={toggleNav} />
      <Title title={title} />

      <div className="l-Main__View l-View">
        <div className={`l-View__Nav--${nav ? "display" : "hide"} l-View__Nav`}>
          <Nav setNav={setNav} TokenManager={TokenManager} />
        </div>

        <div className={`l-View__Content--${nav ? "hide" : "display"} l-View__Content`}>
          <main>
            {typeof children === "function"
              ? children({ nav, setNav, toggleNav })
              : children
            }
          </main>
          <Footer />
        </div>
      </div>
    </div >
  );
}

export default PageLayout;
