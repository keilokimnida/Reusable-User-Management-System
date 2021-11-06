import React from 'react';
import { NavLink } from 'react-router-dom';

const Error = ({ heading, description, displayLink, link }) => (
  <div className="c-Error">
    <h1>{heading ? heading : "Something went Wrong!"}</h1>
    <p>{description ? description : "Try again later."}</p>
    {
      link ?
        <NavLink to={link ? link : "/home"}>{displayLink ? displayLink : "Go to Home"}</NavLink> :
        null
    }

  </div>
);

export default Error;
