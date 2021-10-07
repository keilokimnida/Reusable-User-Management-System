import { useState, useRef } from 'react';
import useClickedOutside from '../hooks/useClickedOutside';

import { Link } from 'react-router-dom'

const Avatar = () => {
  const [menu, setMenu] = useState(false);
  const menuRef = useRef(null);
  const avatarRef = useRef(null);

  // it looks like the useEffect hook...
  // it checks if the user clicked outside of the reference component
  // the callback has a boolean parameter
  useClickedOutside(menuRef, (isOutside) => isOutside && setMenu(false), [avatarRef]);

  const toggleMenu = () => setMenu(!menu);

  const getInitials = () => {
    const displayName = localStorage.getItem("display_name");
    if (!displayName) return "";

    const name = displayName.split(" ");
    let n;
    if (name.length > 1) n = name[0][0].toUpperCase() + name[name.length - 1][0].toUpperCase();
    else n = name[0].slice(0, 2);
    return n;
  }

  return (
    <div className="c-Avatar">
      <span
        ref={avatarRef}
        onClick={() => toggleMenu()}
      >
        <img
          alt="avatar"
          src="https://res.cloudinary.com/cmpkiwidit/image/upload/w_1000,c_fill,ar_1:1,g_auto,r_max,bo_5px_solid_red,b_rgb:262c35/v1613547690/samples/people/smiling-man.jpg"
        />

        <div className="c-Avatar__Placeholder">{getInitials()}</div>
      </span>

      {/* the menu when the avatar is clicked on */}
      <div
        ref={menuRef}
        className={`c-Avatar__Pop-up--${menu ? "display" : "hide"} c-Avatar__Pop-up`}
      >
        <div className="c-Pop-up__Inner">
          <h4>{localStorage.getItem("username")}</h4>
          <Link
            to="/me"
            onClick={() => setMenu(false)}
            className="c-Btn c-Btn--primary">
            Manage
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Avatar;
