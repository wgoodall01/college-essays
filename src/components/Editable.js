import React from 'react';
import classnames from 'classnames';
import './Editable.css';

export class Textarea extends React.Component {
  constructor(props) {
    super(props);
    this.textarea = React.createRef();
  }

  componentDidMount() {
    this._resize();
  }

  _resize = () => {
    const el = this.textarea.current;
    el.style.height = 'auto';
    el.style.height = el.scrollHeight + 'px';
  };

  _onInput = e => {
    this.props.onChange(e);
    this._resize();
  };

  render() {
    const {onChange, className, value, ...rest} = this.props;
    return (
      <textarea
        ref={this.textarea}
        className={classnames('Editable', 'Editable_textarea', className)}
        value={value}
        onChange={this._onInput}
        onFocus={this._resize}
        {...rest}
      />
    );
  }
}

export const Input = ({className, ...rest}) => (
  <input className={classnames('Editable', 'Editable_input', className)} {...rest} />
);
