import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'class-names';

class Toggle extends React.Component {
  state = {
    open: false
  };

  render() {
    const open = this.props.open || this.state.open;

    return (
      <details className={classnames('Toggle')} open={open}>
        <summary>{label}</summary>
        {children}
      </details>
    );
  }
}
