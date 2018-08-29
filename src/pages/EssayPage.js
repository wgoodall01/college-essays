import React from 'react';
import PropTypes from 'prop-types';
import {Textarea, Input} from '../components/Editable.js';
import {throttle, pick} from 'lodash-es';
import {FontAwesomeIcon as Fa} from '@fortawesome/react-fontawesome';
import {faCircleNotch, faArrowLeft} from '@fortawesome/free-solid-svg-icons';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';
import history from '../lib/history.js';
import Button from '../components/Button.js';
import Shade from '../components/Shade.js';

import './EssayPage.css';

class EssayPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      essay: null,
      loading: true,
      dirty: false
    };

    // Add 'just now', '2 minutes ago', etc.
    TimeAgo.locale(en);
    this.timeAgo = new TimeAgo('en-US');
  }

  static _fieldsToUpdate = ['Name', 'Essay', '_updated'];

  static propTypes = {
    // airtable connector, readonly flag
    base: PropTypes.func.isRequired,
    readOnly: PropTypes.bool.isRequired,

    // Airtable ID of essay record in 'Writing'
    essayId: PropTypes.string.isRequired
  };

  async componentDidMount() {
    // Fetch the essay
    this._fetchEssay();

    // Update the 'last saved' text periodically.
    this.updateInterval = setInterval(() => {
      this.forceUpdate();
    }, 1000 * 10);

    // Update the record periodically from airtable, if no edits are made.
    this.refetchInterval = setInterval(() => {
      if (!this.state.dirty) {
        this._fetchEssay();
      }
    }, 1000 * 60);
  }

  componentWillUnmount() {
    clearInterval(this.updateInterval);
  }

  _fetchEssay = async () => {
    // Load the esasy from Airtable

    const {base, essayId} = this.props;
    const res = await base('Writing').find(essayId);
    this.setState({loading: false, essay: res.fields, dirty: false});
    console.log('<EssayPage/>: fetched essay', essayId);
  };

  // Save record max once every 1.5s.
  _scheduleSave = throttle(async () => {
    const {essayId, base, readOnly} = this.props;
    const saveEssay = pick(this.state.essay, EssayPage._fieldsToUpdate);
    if (!readOnly) {
      // updated timestamp
      const timestamp = new Date();
      saveEssay._updated = timestamp.toISOString();
      this.setState(state => ({essay: saveEssay}));

      await base('Writing').update(essayId, saveEssay);
      this.setState({dirty: false});
      console.log('<EssayPage/>: saved essay', {id: essayId, obj: saveEssay});
    } else {
      throw new Error('<EssayPage/>: _scheduleSave() called when readOnly=true');
    }
  }, 1500);

  _setEssayState = (key, value) => {
    this.setState(state => ({dirty: true, essay: {...state.essay, [key]: value}}));
    this._scheduleSave();
  };

  render() {
    const {base, readOnly, essayId} = this.props;
    const {loading, essay} = this.state;

    if (loading) {
      return (
        <div>
          <h1 className="EssayPage_loading">
            <Fa icon={faCircleNotch} spin /> Loading...
          </h1>
        </div>
      );
    }

    return (
      <div>
        <Button onClick={() => history.goBack()} icon={<Fa icon={faArrowLeft} />} />
        {essay._updated && (
          <Shade>last saved {this.timeAgo.format(new Date(essay._updated))}</Shade>
        )}
        <h1 className="EssayPage_title">
          <Input
            value={essay['Name']}
            onChange={e => this._setEssayState('Name', e.target.value)}
          />
        </h1>
        <Textarea
          value={essay['Essay']}
          onChange={e => this._setEssayState('Essay', e.target.value)}
        />
      </div>
    );
  }
}

export default EssayPage;
