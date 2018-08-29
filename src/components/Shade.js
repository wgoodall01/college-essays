import React from 'react';
import classnames from 'classnames';
import './Shade.css';

const Shade = ({children, className, ...rest}) => (
  <span className={classnames('Shade', className)} {...rest}>
    {children}
  </span>
);

export default Shade;
