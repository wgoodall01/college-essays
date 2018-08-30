import React from 'react';
import PropTypes from 'prop-types';
import {Input} from '../components/Editable.js';
import Button from '../components/Button.js';
import {pick} from 'lodash-es';
import './LoginPage.css';

class LoginPage extends React.Component {
  state = {
    readKey: '',
    writeKey: '',
    baseId: ''
  };

  static propTypes = {
    onSubmit: PropTypes.func.isRequired
  };

  static _authParams = ['readKey', 'writeKey', 'baseId'];

  _mapInputState = key => ({
    value: this.state[key],
    onChange: e => this.setState({[key]: e.target.value})
  });

  _submit = e => {
    e.preventDefault();
    if (this._canSubmit()) {
      this.props.onSubmit(pick(this.state, LoginPage._authParams));
    }
  };

  _canSubmit = () => this.state.baseId.length > 5 && this.state.writeKey.length > 5;

  render() {
    return (
      <form onSubmit={this._submit}>
        <h1 className="LoginPage_header">Sign In to College Essays</h1>
        <label className="LoginPage_control">
          <div>API key:</div>
          <Input shade small {...this._mapInputState('writeKey')} />
        </label>
        <label className="LoginPage_control">
          <div>Read-Only API key (for sharing):</div>
          <Input shade small {...this._mapInputState('readKey')} />
        </label>
        <label className="LoginPage_control">
          <div>Base ID:</div>
          <Input shade small {...this._mapInputState('baseId')} />
        </label>

        <Button disabled={!this._canSubmit()}>Sign In</Button>
      </form>
    );
  }
}

export default LoginPage;
