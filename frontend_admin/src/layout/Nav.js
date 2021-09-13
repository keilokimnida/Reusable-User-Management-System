import { useState } from 'react';

import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import { CaretDownFill, CaretRightFill } from 'react-bootstrap-icons';

import NAV_LIST from '../config/navList';

const NavItem = ({ name, route }) => (
  <Link to={route} className="px-3 py-0">
    {name}
  </Link>
);

const NavList = ({ name, items }) => {
  const [collapsed, setCollapsed] = useState(true);
  return (
    <div className="px-3 py-0" onClick={() => setCollapsed(!collapsed)}>
      {collapsed ? <CaretRightFill /> : <CaretDownFill />}
      <div className="d-inline m-2">{name}</div>
      {collapsed ? null : null}
    </div>
  );
};

const RenderNavItems = ({ list }) => list.map(item => {
  if (item.route) return (<NavItem name={item.name} route={item.route} />);
  if (item.sub) return (<NavList name={item.name} items={item.sub} />);
  return null;
});

const Nav = () => {
  return (
    <nav className="w-100 h-100 bg-dark text-white py-3 d-flex flex-column">
      <RenderNavItems list={NAV_LIST} />
    </nav>
  );
}

export default Nav;
