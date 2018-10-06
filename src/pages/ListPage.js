import React from 'react';
import PropTypes from 'prop-types';
import Loading from '../components/Loading.js';
import Shade from '../components/Shade.js';
import ClearLink from '../components/ClearLink.js';
import ExportButton from '../components/ExportButton.js';
import {FontAwesomeIcon as Fa} from '@fortawesome/react-fontawesome';
import {faSearch} from '@fortawesome/free-solid-svg-icons';
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
    filter: '',
    loading: true
  };

  static propTypes = {
    base: PropTypes.func.isRequired
  };

  _fetchEssays = async () => {
    const {base} = this.props;
    const res = await base('Writing')
      .select({
        sort: [{field: '_updated', direction: 'desc'}, {field: 'Name', direction: 'asc'}]
      })
      .all();
    this.setState({loading: false, essays: res});
  };

  componentDidMount() {
    this._fetchEssays();
  }

  render() {
    const {base} = this.props;
    const {essays, loading, filter} = this.state;

    const EssayCard = ({fields, id}) => (
      <ClearLink className="ListPage_item" to={`/essay/${id}`}>
        <div className="ListPage_item">
          <h2>{fields['Name']}</h2>
          {fields['Essay'] && (
            <Shade>
              <p>{fields['Essay'].slice(0, 480)}</p>
            </Shade>
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
              onChange={e => this.setState({filter: e.target.value})}
            />
          </div>
          <ExportButton base={base}>Export All</ExportButton>
        </div>
        {loading && <Loading />}
        {!loading && (
          <React.Fragment>
            {essays.filter(e => filterPredicate(filter, e.fields['Name'])).map(e => (
              <EssayCard fields={e.fields} id={e.id} key={e.id} />
            ))}
          </React.Fragment>
        )}
      </div>
    );
  }
}

export default ListPage;
