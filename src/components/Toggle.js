import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import {FontAwesomeIcon as Fa} from '@fortawesome/react-fontawesome';
import {faCaretRight, faCaretDown} from '@fortawesome/free-solid-svg-icons';
import './Toggle.css';

class Toggle extends React.Component {
  state = {
    open: false
  };

  render() {
    const {children, label, open: openProp, onToggle} = this.props;
    const open = this.props.open || this.state.open;

    return (
      <div className={classnames('Toggle', {Toggle_open: open, Toggle_closed: !open})} open={open}>
        <label
          className="Toggle_label"
          onClick={e => (onToggle ? onToggle(e) : this.setState({open: !open}))}
        >
          <Fa
            className="Toggle_caret"
            size="lg"
            fixedWidth
            icon={open ? faCaretDown : faCaretRight}
          />
          {label}
        </label>
        {open && children}
      </div>
    );
  }
}

export default Toggle;
