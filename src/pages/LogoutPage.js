import React from 'react';
import PropTypes from 'prop-types';
import {Redirect} from 'react-router';

const LogoutPage = ({logOut}) => {
  logOut();
  return <Redirect to="/login" />;
};

LogoutPage.propTypes = {
  logOut: PropTypes.func.isRequired
};

export default LogoutPage;
