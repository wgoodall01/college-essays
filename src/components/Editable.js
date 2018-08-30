import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import './Editable.css';

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
    shade: PropTypes.bool
  };

  componentDidMount() {
    this._resize();
  }

  _resize = () => {
    const el = this.textarea.current;
    el.style.height = 'auto';
    el.style.height = el.scrollHeight + 'px';
  };

  _onInput = e => {
    if (this.props.onChange) {
      this.props.onChange(e);
    }
    this._resize();
  };

  render() {
    const {onChange, className, value, outset, shade, ...rest} = this.props;
    return (
      <textarea
        ref={this.textarea}
        className={classnames(
          'Editable',
          'Editable_textarea',
          {Editable_outset: outset},
          {Editable_shade: shade},
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

export const Input = ({className, shade, outset, small, ...rest}) => (
  <input
    className={classnames(
      'Editable Editable_input',
      {Editable_small: small},
      {Editable_outset: outset},
      {Editable_shade: shade},
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
  outset: PropTypes.bool
};
