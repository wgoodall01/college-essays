import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import {Link} from 'react-router-dom';

import './Button.css';

export const Button = ({el, icon, right, small, className, children, ...rest}) => {
  const Container = el || 'button';
  return (
    <Container
      className={classnames(
        'Button',
        {Button_right: right},
        {Button_small: small},
        {'Button_only-icon': !children},
        className
      )}
      {...rest}
    >
      {icon && (
        <span className={classnames('Button_icon', {'Button_only-icon': !children})}>{icon}</span>
      )}
      {children}
    </Container>
  );
};

export const ButtonLink = props => Button({...props, el: Link});

Button.propTypes = {
  el: PropTypes.element,
  icon: PropTypes.node,
  small: PropTypes.bool,
  className: PropTypes.string,
  children: PropTypes.node
};

export default Button;
