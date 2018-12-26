import React from 'react';
import PropTypes from 'prop-types';
import {Textarea, Input} from '../components/Editable.js';
import {throttle, pick} from 'lodash-es';
import {FontAwesomeIcon as Fa} from '@fortawesome/react-fontawesome';
import {faArrowLeft, faThumbtack, faUnlock} from '@fortawesome/free-solid-svg-icons';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';
import {ButtonLink} from '../components/Button.js';
import Shade from '../components/Shade.js';
import Loading from '../components/Loading.js';
import Toggle from '../components/Toggle.js';
import Lint from '../components/Lint.js';
import Paragraph from '../lib/Paragraph.js';
import Attachments from '../components/Attachments.js';
import {Helmet} from 'react-helmet';
import classnames from 'classnames';
import {getRequirements} from '../lib/db.js';
import {wordCount} from '../lib/wordCount.js';
import Button from '../components/Button.js';

import './EssayPage.css';

class EssayPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      essay: null,
      requirements: null, // async loaded after essay
      loading: true, // essay is loading?
      pinExtras: false,
      weakSelection: [0, 0], // weak selection in essay
      selectCount: null, // word count in selection
      dirty: false
    };

    // Add 'just now', '2 minutes ago', etc.
    TimeAgo.locale(en);
    this.timeAgo = new TimeAgo('en-US');
  }

  static _fieldsToUpdate = ['Name', 'Essay', 'Prompt', 'Brainstorming', '_updated'];

  static propTypes = {
    // airtable connector, readonly flag
    base: PropTypes.func.isRequired,
    readOnly: PropTypes.bool.isRequired,

    // Airtable ID of essay record in 'Writing'
    essayId: PropTypes.string.isRequired
  };

  async componentDidMount() {
    // Fetch the essay
    await this._fetchEssay();

    // Fetch the requirements (in the background)
    this._fetchRequirements();

    // Update the 'last saved' text periodically.
    this.updateInterval = setInterval(() => {
      this.forceUpdate();
    }, 1000 * 10);

    // Update the record periodically from airtable, if no edits are made.
    // this.refetchInterval = setInterval(() => {
    //   if (!this.state.dirty) {
    //     this._fetchEssay();
    //   }
    // }, 1000 * 60);
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

  _fetchRequirements = async () => {
    // Ugly n+1 query because Airtable doesn't have joins.
    const {base} = this.props;
    const {essay} = this.state;

    this.setState({requirements: await getRequirements(base, essay)});
  };

  _onSelect = e => {
    const {selectionStart, selectionEnd} = e.target;
    const text = this.state.essay['Essay'];

    if (selectionEnd !== selectionStart) {
      this.setState({selectCount: wordCount(text.slice(selectionStart, selectionEnd))});
    } else {
      this.setState({selectCount: null});
    }
  };

  // Save record max once every 1.5s.
  _scheduleSave = throttle(async () => {
    const {essayId, base, readOnly} = this.props;
    const saveEssay = pick(this.state.essay, EssayPage._fieldsToUpdate);
    if (!readOnly) {
      // updated timestamp
      const timestamp = new Date();
      saveEssay._updated = timestamp.toISOString();

      await base('Writing').update(essayId, saveEssay);
      this.setState(state => ({dirty: false, essay: {...state.essay, _updated: timestamp}}));
      console.log('<EssayPage/>: saved essay', {id: essayId, obj: saveEssay});
    } else {
      throw new Error('<EssayPage/>: _scheduleSave() called when readOnly=true');
    }
  }, 1500);

  _setEssayState = (key, value) => {
    this.setState(
      state => ({dirty: true, essay: {...state.essay, [key]: value}}),
      this._scheduleSave
    );
  };

  render() {
    const {readOnly} = this.props;
    const {pinExtras, loading, essay, requirements, weakSelection} = this.state;

    const bindField = key => ({
      value: essay[key],
      onChange: e => this._setEssayState(key, e.target.value),
      readOnly
    });

    return (
      <div className="EssayPage">
        <ButtonLink className="EssayPage_hide-print" to="/" icon={<Fa icon={faArrowLeft} />} />
        {loading && <Loading loading={loading} />}
        {!loading && (
          <React.Fragment>
            <Helmet>
              <title>{essay['Name']}</title>
            </Helmet>
            {essay._updated && (
              <Shade className="EssayPage_hide-print" title={new Date(essay._updated)}>
                last updated {this.timeAgo.format(new Date(essay._updated))}
              </Shade>
            )}
            <h1 className="EssayPage_title">
              <Input outset {...bindField('Name')} readOnly={readOnly} />
            </h1>
            <div className={classnames({'EssayPage_sticky-extras': pinExtras})}>
              <Toggle label="Prompt">
                <Textarea placeholder="What to do?" {...bindField('Prompt')} />
              </Toggle>
              <Toggle label="Brainstorming">
                <Textarea placeholder="Put some good ideas here" {...bindField('Brainstorming')} />
              </Toggle>
              <Toggle label="For">
                <ul>
                  {requirements && requirements.map(e => <li key={e.id}>{e.fields['Name']}</li>)}
                </ul>
              </Toggle>
              {essay['Attachments'] && (
                <Toggle label="Attachments">
                  <Attachments files={essay['Attachments']} />
                </Toggle>
              )}
              <Toggle label="Lint">
                <Lint
                  className="EssayPage_lint-results"
                  text={essay['Essay']}
                  onHighlight={error =>
                    this.setState({weakSelection: [error.index, error.index + error.offset]})
                  }
                />
              </Toggle>
              <Button
                small
                className="EssayPage_extra EssayPage_hide-print"
                onClick={() => this.setState(s => ({pinExtras: !s.pinExtras}))}
              >
                <Fa fixedWidth icon={pinExtras ? faUnlock : faThumbtack} />
              </Button>

              {essay['Essay'] && (
                <Shade className="EssayPage_extra">
                  {wordCount(this.state.essay['Essay'] || '')}
                  {this.state.selectCount && ` (${this.state.selectCount})`} words
                </Shade>
              )}
            </div>
            <Textarea
              className="EssayPage_hide-print"
              noBorder
              outset
              placeholder="Once upon a time..."
              {...bindField('Essay')}
              weakSelection={weakSelection}
              onSelect={this._onSelect}
            />
            <div className="EssayPage_hide-screen EssayPage_print-text-format">
              <Paragraph>{this.state.essay['Essay']}</Paragraph>
            </div>
          </React.Fragment>
        )}
      </div>
    );
  }
}

export default EssayPage;
