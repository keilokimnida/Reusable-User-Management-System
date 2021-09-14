import { useState } from 'react';

import { Link } from 'react-router-dom';
import { CaretDownFill, CaretRightFill } from 'react-bootstrap-icons';

import { getAll } from '../utils/localStorage';

import styles from './Nav.module.css';
import NAV_LIST from '../config/navList';

const NavItem = ({ name, route, handleClick }) => {
  if (handleClick) return (
    <div onClick={() => handleClick()} className={`px-3 py-0 ${styles.navItems}`}>
      {name}
    </div>
  );

  let to = typeof route === "function" ? route(getAll()) : route;
  return (
    <Link to={to} className={`px-3 py-0 ${styles.navItems}`}>
      {name}
    </Link>
  );
}

const NavSub = ({ name, route, handleClick }) => {
  if (handleClick) return (
    <div onClick={() => handleClick()} className={`px-3 py-0 ${styles.navItems}`}>
      <div className={styles.navSubIndent}>{name}</div>
    </div>
  );

  let to = typeof route === "function" ? route(getAll()) : route;
  return (
    <Link to={to} className={`px-3 py-0 ${styles.navItems}`}>
      <div className={styles.navSubIndent}>{name}</div>
    </Link>
  );
};

const NavList = ({ name, sub: items }) => {
  const [collapsed, setCollapsed] = useState(true);
  return (
    <>
      <div
        className={`px-3 py-0 ${styles.navItems}`}
        onClick={() => setCollapsed(!collapsed)}
      >
        <div>
          {collapsed ? <CaretRightFill /> : <CaretDownFill />}
        </div>
        {name}
      </div >
      {collapsed
        ? null
        : items.map((item, i) => <NavSub {...item} key={i} />)
      }
    </>
  );
};

const NavMap = ({ list }) => list.map((item, i) => {
  if (item.route) return (<NavItem {...item} key={i} />);
  if (item.sub) return (<NavList {...item} key={i} />);
  return null;
});

const Nav = () => {
  return (
    <nav className="w-100 h-100 bg-dark text-white py-3 d-flex flex-column">
      <NavMap list={NAV_LIST} />
    </nav>
  );
}

export default Nav;
