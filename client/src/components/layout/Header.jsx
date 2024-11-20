import React from 'react'
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <div className=" p-5 text-xl text-center sm:text-left font-semibold shadow-md">
      <Link to='/'>Role Based User Management App</Link>
    </div>
  );
}

export default Header