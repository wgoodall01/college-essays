import React from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import './Header.css';

const loc = window.location;

const Header = ({baseId, readKey, logOut}) => (
  <div className="Header">
    {baseId &&
      readKey && (
        <a href={`${loc.origin}${loc.pathname}#/access/${readKey},${baseId}/${loc.hash.slice(2)}`}>
          share page
        </a>
      )}
    <Link to="/login" onClick={logOut}>
      logout
    </Link>
  </div>
);

Header.propTypes = {
  baseId: PropTypes.string,
  readKey: PropTypes.string,
  logOut: PropTypes.func
};

export default Header;
