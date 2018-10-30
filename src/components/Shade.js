import React from 'react';
import classnames from 'classnames';
import './Shade.css';

const Shade = ({children, className, tag, ...rest}) => {
  const Container = 'span' || tag;
  return (
    <Container className={classnames('Shade', className)} {...rest}>
      {children}
    </Container>
  );
};

export default Shade;
