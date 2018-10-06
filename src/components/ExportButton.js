import React from 'react';
import PropTypes from 'prop-types';
import Button from '../components/Button.js';
import {FontAwesomeIcon as Fa} from '@fortawesome/react-fontawesome';
import {faFileDownload, faCircleNotch} from '@fortawesome/free-solid-svg-icons';

class ExportButton extends React.Component {
  state = {
    exporting: false
  };

  _onClick = async () => {
    const {base} = this.props;
    this.setState({exporting: true});

    const {generate, save} = await import('../lib/export.js');
    const file = await generate({base});
    await save(file, 'CollegeEssays.html');

    this.setState({exporting: false});
  };

  static propTypes = {
    base: PropTypes.func.isRequired
  };

  render() {
    const {children} = this.props;
    const {exporting} = this.state;

    return (
      <Button
        right
        onClick={this._onClick}
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
    );
  }
}

export default ExportButton;
