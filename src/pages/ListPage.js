import React from 'react';
import PropTypes from 'prop-types';
import Loading from '../components/Loading.js';
import Shade from '../components/Shade.js';
import ClearLink from '../components/ClearLink.js';
import ExportButton from '../components/ExportButton.js';
import {FontAwesomeIcon as Fa} from '@fortawesome/react-fontawesome';
import {faSearch, faLevelDownAlt} from '@fortawesome/free-solid-svg-icons';
import {getEssays} from '../lib/db.js';
import history from '../lib/history.js';
import './ListPage.css';

const filterPredicate = (filter, text) => {
  if (filter === '') {
    return true;
  }

  const filterTokens = filter
    .toLowerCase()
    .split(' ')
    .filter(e => e.length > 0);

  const normalText = text.toLowerCase();

  for (let ft of filterTokens) {
    if (normalText.indexOf(ft) === -1) {
      return false;
    }
  }

  return true;
};

class ListPage extends React.Component {
  state = {
    essays: [],
    filteredEssays: null,
    filter: '',
    loading: true
  };

  static propTypes = {
    base: PropTypes.func.isRequired
  };

  _fetchEssays = async () => {
    const {base} = this.props;
    const res = await getEssays(base);
    this.setState({loading: false, essays: res});
  };

  _refilter = filter => {
    const {essays} = this.state;
    if (filter) {
      this.setState({
        filter,
        filteredEssays: essays.filter(e => filterPredicate(filter, e.fields['Name']))
      });
    } else {
      this.setState({
        filter,
        filteredEssays: null
      });
    }
  };

  _handleInputKey = e => {
    const {filteredEssays} = this.state;
    if (e.key === 'Enter' && filteredEssays !== null && filteredEssays.length >= 1) {
      history.push(`/essay/${filteredEssays[0].id}`);
    }
  };

  componentDidMount() {
    this._fetchEssays();
  }

  render() {
    const {base} = this.props;
    const {essays, filteredEssays, loading, filter} = this.state;

    const displayEssays = filteredEssays || essays;

    const EssayCard = ({fields, id, enterToOpen}) => (
      <ClearLink className="ListPage_item" to={`/essay/${id}`}>
        <div className="ListPage_item">
          <h2>{fields['Name']}</h2>
          {fields['Essay'] && (
            <Shade>
              <p>{fields['Essay'].slice(0, 480)}</p>
            </Shade>
          )}
          {enterToOpen && (
            <div className="ListPage_enter-to-open">
              <Fa transform="rotate-270 flip-v" icon={faLevelDownAlt} />
              Enter to open
            </div>
          )}
        </div>
      </ClearLink>
    );

    return (
      <div>
        <h1>Essays</h1>
        <div className="ListPage_tools">
          <div className="ListPage_filter-bar">
            <Fa icon={faSearch} color="var(--color-shade-text)" />
            <input
              className="ListPage_filter"
              placeholder="Filter..."
              value={filter}
              onChange={e => this._refilter(e.target.value)}
              onKeyPress={this._handleInputKey}
            />
          </div>
          <ExportButton base={base}>Export</ExportButton>
        </div>
        {loading && <Loading />}
        {!loading && (
          <React.Fragment>
            {displayEssays.map((e, i) => (
              <EssayCard
                fields={e.fields}
                id={e.id}
                enterToOpen={i === 0 && filter.length !== 0}
                key={e.id}
              />
            ))}
          </React.Fragment>
        )}
      </div>
    );
  }
}

export default ListPage;
