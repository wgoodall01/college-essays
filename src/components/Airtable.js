import React from 'react';
import PropTypes from 'prop-types';
import Airtable from 'airtable';

// Quick and dirty hash function.
// adapted from https://stackoverflow.com/a/8831937/3029676
const hashObject = obj =>
  JSON.stringify(obj)
    .split('')
    .map(e => e.charCodeAt(0))
    .reduce((a, b) => (a << 5) - a + b, 0);

const {Provider, Consumer} = React.createContext();

export class AirtableProvider extends React.Component {
  state = {
    base: null, // airtable base
    hash: null // hash of all important props, used to re-initialize airtable.
  };

  static propTypes = {
    baseId: PropTypes.string.isRequired,
    apiKey: PropTypes.string.isRequired,
    readOnly: PropTypes.bool.isRequired,
    children: PropTypes.element
  };

  static getDerivedStateFromProps(props, state) {
    const {hash: oldHash} = state;
    const {baseId, apiKey, readOnly} = props;

    // If anything changes, return a new airtable instance.
    const hash = hashObject([apiKey, baseId, readOnly]);

    if (hash !== oldHash) {
      // Airtable params have changed
      const base = new Airtable({apiKey}).base(baseId);
      console.log('<AirtableProvider/>: reconnect:', {baseId, apiKey, readOnly, hash});
      if (process.env.NODE_ENV === 'development') {
        window.base = base;
        console.log('<AirtableProvider/>: stored as window.base');
      }
      return {hash, base};
    }

    return null; // no change needed
  }

  render() {
    const {readOnly, children} = this.props;
    const {hash, base} = this.state;

    // use a keyed fragment to re-render everything
    return (
      <React.Fragment key={hash}>
        <Provider value={{base, readOnly}}>{children}</Provider>
      </React.Fragment>
    );
  }
}

export const AirtableConsumer = Consumer;
