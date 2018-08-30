import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import {Link} from 'react-router-dom';
import './ClearLink.css';

const ClearLink = ({className, children, ...rest}) => (
  <Link className={classnames('ClearLink', className)} {...rest}>
    {children}
  </Link>
);

ClearLink.propTypes = {
  to: PropTypes.string.isRequired,
  className: PropTypes.string,
  children: PropTypes.node.isRequired
};

export default ClearLink;
