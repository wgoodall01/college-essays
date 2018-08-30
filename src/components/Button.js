import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import {Link} from 'react-router-dom';

import './Button.css';

export const Button = ({icon, small, className, children, ...rest}) => (
  <button
    className={classnames(
      'Button',
      {Button_small: small},
      {'Button_only-icon': !children},
      className
    )}
    {...rest}
  >
    <span className={classnames('Button_icon', {'Button_only-icon': !children})}>{icon}</span>
    {children}
  </button>
);

export const ButtonLink = ({icon, small, className, children, ...rest}) => (
  <Link
    className={classnames(
      'Button',
      {Button_small: small},
      {'Button_only-icon': !children},
      className
    )}
    {...rest}
  >
    <span className={classnames('Button_icon', {'Button_only-icon': !children})}>{icon}</span>
    {children}
  </Link>
);

Button.propTypes = {
  icon: PropTypes.node,
  small: PropTypes.bool,
  className: PropTypes.string,
  children: PropTypes.node
};

export default Button;
