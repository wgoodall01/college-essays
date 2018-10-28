import React from 'react';
import PropTypes from 'prop-types';
import Button from '../components/Button.js';
import {FontAwesomeIcon as Fa} from '@fortawesome/react-fontawesome';
import {faFileDownload, faCircleNotch} from '@fortawesome/free-solid-svg-icons';
import {pick} from 'lodash-es';
import './ExportButton.css';

class ExportButton extends React.Component {
  state = {
    exporting: false,

    open: false, // modal open

    // various export options, passed as generate({parts})
    written_for: true,
    prompt: true,
    brainstorming: true,
    attachments: true
  };

  _onExport = async () => {
    const {base} = this.props;
    this.setState({exporting: true});

    const {generate, save} = await import('../lib/export.js');
    const file = await generate({
      base,
      parts: pick(this.state, ['written_for', 'prompt', 'brainstorming', 'attachments'])
    });
    await save(file, 'CollegeEssays.html');

    this.setState({exporting: false});
  };

  _toggleOpen = () => {
    this.setState(state => ({open: !state.open}));
  };

  static propTypes = {
    base: PropTypes.func.isRequired
  };

  render() {
    const {children} = this.props;
    const {exporting, open} = this.state;

    const Checkbox = ({keyName, label}) => (
      <div className="ExportButton_checkbox">
        <label>
          <input
            type="checkbox"
            checked={this.state[keyName]}
            onChange={e => this.setState({[keyName]: e.target.checked})}
          />
          <span>{label}</span>
        </label>
      </div>
    );

    return (
      <React.Fragment>
        <Button
          right
          onClick={this._toggleOpen}
          icon={
            exporting ? (
              <Fa fixedWidth icon={faCircleNotch} spin />
            ) : (
              <Fa fixedWidth icon={faFileDownload} />
            )
          }
        >
          {children}
        </Button>
        {open && (
          <div className="ExportButton_cover" onClick={this._toggleOpen}>
            <div className="ExportButton_dialog" onClick={e => e.stopPropagation()}>
              <button className="ExportButton_cancel" onClick={this._toggleOpen}>
                cancel
              </button>
              <h2>Export Options</h2>
              <Checkbox keyName="written_for" label={'Show "Written For"'} />
              <Checkbox keyName="prompt" label="Show Prompt" />
              <Checkbox keyName="brainstorming" label="Show Brainstorming" />
              <Checkbox keyName="attachments" label="Show Attachments" />
              <Button
                className="ExportButton_button"
                onClick={this._onExport}
                icon={
                  exporting ? (
                    <Fa fixedWidth icon={faCircleNotch} spin />
                  ) : (
                    <Fa fixedWidth icon={faFileDownload} />
                  )
                }
              >
                Export Essays
              </Button>
            </div>
          </div>
        )}
      </React.Fragment>
    );
  }
}

export default ExportButton;
