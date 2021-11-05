import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

import { Link } from 'react-router-dom';
import { CaretDownFill, CaretRightFill } from 'react-bootstrap-icons';

import BREAKPOINTS from '../config/breakpoints';
import NAV_LIST from '../config/navList';
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";

const NavItem = ({ name, route, type, sub, setNav, TokenManager }) => {
  // this is to close the nav when it is on a smaller screen and occupies the entire viewport
  const collapseNavIfSmall = () => window.innerWidth < BREAKPOINTS.lg ? setNav(false) : null;
  const history = useHistory();

  const handleLogout = async () => {
    const res = await TokenManager.logout();
    if (res) {
      toast("Logged out successfully");
      history.push("/login");
    } else {
      toast("Logged out failed");
    }

  };

  if (type === "logout") return (
    <div
      onClick={() => {
        collapseNavIfSmall();
        handleLogout();
      }}
      className={`c-List-item`}
    >
      {sub
        ? <h3 className="c-List-item__Indent">{name}</h3>
        : <h2>{name}</h2>
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
        ? <h3 className="c-List-item__Indent">{name}</h3>
        : <h2>{name}</h2>
      }
    </Link>
  );
}

const NavList = ({ name, sub: items, setNav, TokenManager }) => {
  const [collapsed, setCollapsed] = useState(true);
  return (
    <div className = "c-Nav__List c-List">
      <div
        className={`c-List__Display`}
        onClick={() => setCollapsed(!collapsed)}
      >
        {collapsed ? <CaretRightFill /> : <CaretDownFill />}
        <span>{name}</span>
      </div >

      {collapsed
        ? null
        : items.map((item, i) => <NavItem setNav={setNav} sub {...item} key={i} TokenManager={TokenManager}/>)
      }
    </div>
  );
};

const Nav = ({ setNav, TokenManager }) => {
  return (
    <nav className="c-Nav">
      {NAV_LIST.map((item, i) => item.sub
        ? <NavList setNav={setNav} {...item} key={i} TokenManager={TokenManager}/>
        : <NavItem setNav={setNav} {...item} key={i} TokenManager={TokenManager} />
      )}
    </nav>
  );
}

export default Nav;
