import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import './Button.css';

const Button = ({icon, small, className, children, ...rest}) => (
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

Button.propTypes = {
  icon: PropTypes.node,
  small: PropTypes.bool,
  className: PropTypes.string,
  children: PropTypes.node
};

export default Button;
