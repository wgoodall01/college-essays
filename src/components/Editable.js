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
    outset: PropTypes.bool
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
    const {onChange, className, readOnly, value, outset, ...rest} = this.props;
    return (
      <textarea
        ref={this.textarea}
        className={classnames(
          'Editable',
          'Editable_textarea',
          {Editable_outset: outset},
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

export const Input = ({className, outset, small, readOnly, ...rest}) => (
  <input
    className={classnames(
      'Editable Editable_input',
      {Editable_small: small},
      {Editable_outset: outset},
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
  small: PropTypes.bool
};
