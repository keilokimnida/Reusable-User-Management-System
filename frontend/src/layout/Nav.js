import { useState } from 'react';

import { Link } from 'react-router-dom';
import { CaretDownFill, CaretRightFill } from 'react-bootstrap-icons';

import BREAKPOINTS from '../config/breakpoints';
import NAV_LIST from '../config/navList';

const NavItem = ({ name, route, handleClick: customClick, sub, setNav }) => {
  // this is to close the nav when it is on a smaller screen and occupies the entire viewport
  const collapseNavIfSmall = () => window.innerWidth < BREAKPOINTS.lg ? setNav(false) : null;

  if (customClick) return (
    <div
      onClick={() => {
        collapseNavIfSmall();
        customClick();
      }}
      className={`c-List-item`}
    >
      {sub
        ? <div className="c-List-item__Indent">{name}</div>
        : name
      }
    </div>
  );

  const to = typeof route === "function" ? route() : route;
  return (
    <Link
      to={to}
      onClick={() => {
        collapseNavIfSmall();
      }}
      className={`c-List-item`}
    >
      {sub
        ? <div className="c-List-item__Indent">{name}</div>
        : name
      }
    </Link>
  );
}

const NavList = ({ name, sub: items, setNav }) => {
  const [collapsed, setCollapsed] = useState(true);
  return (
    <div className = "c-Nav__List c-List">
      <div
        className={`c-List__Display`}
        onClick={() => setCollapsed(!collapsed)}
      >
        {collapsed ? <CaretRightFill /> : <CaretDownFill />}
        {name}
      </div >

      {collapsed
        ? null
        : items.map((item, i) => <NavItem setNav={setNav} sub {...item} key={i} />)
      }
    </div>
  );
};

const Nav = ({ setNav }) => {
  return (
    <nav className="c-Nav">
      {NAV_LIST.map((item, i) => item.sub
        ? <NavList setNav={setNav} {...item} key={i} />
        : <NavItem setNav={setNav} {...item} key={i} />
      )}
    </nav>
  );
}

export default Nav;
