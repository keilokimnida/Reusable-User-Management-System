import { useState } from 'react';

import { Link } from 'react-router-dom';
import { CaretDownFill, CaretRightFill } from 'react-bootstrap-icons';

import { getAll } from '../utils/localStorage';

import styles from './Nav.module.css';
import NAV_LIST from '../config/navList';

const NavItem = ({ name, route, handleClick: customClick, sub, setNav }) => {
  // this is to close the nav when it is on a smaller screen an occupies the entire viewport
  const collapseNavIfSmall = () => window.innerWidth < 992 ? setNav(false) : null;

  if (customClick) return (
    <div
      onClick={() => {
        collapseNavIfSmall();
        customClick();
      }}
      className={`px-3 py-0 ${styles.navItems}`}
    >
      {sub
        ? <div className={styles.navSubIndent}>{name}</div>
        : name
      }
    </div>
  );

  const to = typeof route === "function" ? route(getAll()) : route;
  return (
    <Link
      to={to}
      onClick={() => {
        collapseNavIfSmall();
      }}
      className={`px-3 py-0 ${styles.navItems}`}
    >
      {sub
        ? <div className={styles.navSubIndent}>{name}</div>
        : name
      }
    </Link>
  );
}

const NavList = ({ name, sub: items, setNav }) => {
  const [collapsed, setCollapsed] = useState(true);
  return (
    <>
      <div
        className={`px-3 py-0 ${styles.navItems}`}
        onClick={() => setCollapsed(!collapsed)}
      >
        {collapsed ? <CaretRightFill /> : <CaretDownFill />}
        {name}
      </div >

      {collapsed
        ? null
        : items.map((item, i) => <NavItem setNav={setNav} sub {...item} key={i} />)
      }
    </>
  );
};

const Nav = ({ setNav }) => {
  return (
    <nav className="w-100 h-100 bg-dark text-white py-3 d-flex flex-column">
      <div className="d-md-none px-3">
        <h2>User Management System</h2>
      </div>

      {NAV_LIST.map((item, i) => item.sub
        ? <NavList setNav={setNav} {...item} key={i} />
        : <NavItem setNav={setNav} {...item} key={i} />
      )}
    </nav>
  );
}

export default Nav;
