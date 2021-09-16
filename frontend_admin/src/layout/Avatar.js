import { useState, useRef } from 'react';
import useClickOutside from '../hooks/useClickedOutside';

import { getAll } from '../utils/localStorage';

import styles from './Avatar.module.css';

const Avatar = () => {
  const [menu, setMenu] = useState(false);
  const menuRef = useRef(null);
  const avatarRef = useRef(null);

  // it looks like the useEffect hook...
  // it checks if the user clicked outside of the reference component
  // the callback has a boolean parameter
  useClickOutside(menuRef, (isOutside) => !isOutside || setMenu(false), [avatarRef]);

  const toggleMenu = () => setMenu(!menu);

  const getInitials = () => {
    const [first, last] = getAll().display_name.split(" ");
    return `${first[0]}${last[0]}`.toUpperCase();
  }

  return (
    <div className={styles.avatarContainer} onBlur={() => toggleMenu()}>
      <span
        ref={avatarRef}
        onClick={() => toggleMenu()}
      >
        <img
          alt="avatar"
          src="https://res.cloudinary.com/cmpkiwidit/image/upload/w_1000,c_fill,ar_1:1,g_auto,r_max,bo_5px_solid_red,b_rgb:262c35/v1613547690/samples/people/smiling-man.jpg"
        />

        <div className={styles.placeholder}>{getInitials()}</div>
      </span>

      <div
        ref={menuRef}
        className={`${menu ? "d-block" : "d-none"} ${styles.menuContainer} p-3 bg-white border rounded shadow-sm`}
      >
        <h4>Hello</h4>
      </div>
    </div>
  );
}

export default Avatar;
