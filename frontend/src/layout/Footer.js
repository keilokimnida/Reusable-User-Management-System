import React from 'react';
import flagSG from '../assets/images/flag-sg.png';

const Footer = () => {
  return (
    <footer className="l-Footer">
      <div className="c-Footer">
        <div className="c-Footer__Top">
          <h1>User Management System</h1>
          <p>Reusable user management system</p>
        </div>
        <hr />
        <div className="c-Footer__Bottom c-Bottom">
          <div className="c-Bottom__Left">
            <p>Built By Project INC Team 1.</p>
          </div>
          <div className="c-Bottom__Right">
            <p>
              <img src={flagSG} alt="SG" />
              Singapore
            </p>
          </div>
        </div>

      </div>

    </footer>
  );
}

export default Footer;
