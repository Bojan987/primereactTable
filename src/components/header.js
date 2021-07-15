import React from "react";
import { NavLink } from "react-router-dom";

const Header = () => {
  return (
    <div className='header'>
      <NavLink
        to='/'
        exact
        activeStyle={{
          fontWeight: "bold",
          color: "red"
        }}>
        Home
      </NavLink>
      <NavLink
        to='/about'
        exact
        activeStyle={{
          fontWeight: "bold",
          color: "red"
        }}>
        About
      </NavLink>
      <NavLink
        to='/login'
        exact
        activeStyle={{
          fontWeight: "bold",
          color: "red"
        }}>
        Login
      </NavLink>
    </div>
  );
};

export default Header;
