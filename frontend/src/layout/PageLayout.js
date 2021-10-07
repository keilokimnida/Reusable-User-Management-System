import { useState } from 'react';

import styles from './PageLayout.module.css';
import BREAKPOINTS from '../config/breakpoints';

import Header from './Header';
import Nav from './Nav';
import Footer from './Footer';
import Title from './Title';

const PageLayout = ({ children, title }) => {
  const [nav, setNav] = useState(window.innerWidth < BREAKPOINTS.lg ? false : true);
  const toggleNav = () => setNav(!nav);

  return (
    <div className={styles.container}>
      <Header toggleNav={toggleNav} />
      <Title title={title} />

      <div className={styles.viewContainer}>
        <div className={`${nav ? "d-block" : "d-none"} ${styles.navContainer}`}>
          <Nav setNav={setNav} />
        </div>

        <div className={`${nav ? "d-none" : "d-flex"} d-lg-flex flex-column ${styles.mainContainer}`}>
          <main className="p-3">
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
