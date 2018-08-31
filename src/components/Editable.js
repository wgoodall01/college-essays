import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import './Editable.css';
import getScrollParent from '../lib/getScrollParent.js';

export class Textarea extends React.Component {
  constructor(props) {
    super(props);
    this.textarea = React.createRef();
  }

  static propTypes = {
    onChange: PropTypes.func,
    className: PropTypes.string,
    readOnly: PropTypes.bool,
    value: PropTypes.string,
    outset: PropTypes.bool,
    shade: PropTypes.bool,
    noBorder: PropTypes.bool
  };

  componentDidMount() {
    this._resize();
  }

  _resize = () => {
    const el = this.textarea.current;

    // store scroll of parent element, so we can reposition it later.
    const scrollParent = getScrollParent(el);
    const oldContainerScroll = scrollParent.scrollTop;

    el.style.height = 'auto';
    const newHeight = el.scrollHeight;
    el.style.height = newHeight + 'px';

    // re-scroll parent, adding any extra height if needed.
    scrollParent.scrollTop = oldContainerScroll;
  };

  _onInput = e => {
    if (this.props.onChange) {
      this.props.onChange(e);
    }
    // this._resize();
  };

  render() {
    const {onChange, className, value, outset, shade, noBorder, ...rest} = this.props;

    if (this.textarea.current) {
      this._resize();
    }

    return (
      <textarea
        ref={this.textarea}
        className={classnames(
          'Editable',
          'Editable_textarea',
          {Editable_outset: outset},
          {Editable_shade: shade},
          {'Editable_no-border': noBorder},
          className
        )}
        value={value}
        onChange={this._onInput}
        onFocus={this._resize}
        {...rest}
      />
    );
  }
}

export const Input = ({className, shade, outset, small, noBorder, ...rest}) => (
  <input
    className={classnames(
      'Editable Editable_input',
      {Editable_small: small},
      {Editable_outset: outset},
      {Editable_shade: shade},
      {'Editable_no-border': noBorder},
      className
    )}
    {...rest}
  />
);

Input.propTypes = {
  className: PropTypes.string,
  readOnly: PropTypes.bool,
  value: PropTypes.string,
  onChange: PropTypes.func,
  small: PropTypes.bool,
  shade: PropTypes.bool,
  outset: PropTypes.bool,
  noBorder: PropTypes.bool
};
