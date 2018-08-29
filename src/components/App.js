import React, {Component} from 'react';
import {Route, Switch} from 'react-router';
import {AirtableProvider, AirtableConsumer} from './Airtable.js';
import {pick} from 'lodash-es';
import './App.css';

import EssayPage from '../pages/EssayPage.js';
import NotFoundPage from '../pages/NotFoundPage.js';

const LOCALSTORAGE_KEY = 'airtable-auth';
const LOCALSTORAGE_ITEMS = ['readKey', 'writeKey', 'baseId', 'tableName'];

class App extends Component {
  constructor(props) {
    super(props);

    let cachedAuth = {
      // Sensible airtable auth defaults
      readKey: null,
      writeKey: null,
      baseId: null
    };
    const cachedAuthJson = window.localStorage.getItem(LOCALSTORAGE_KEY);
    if (cachedAuthJson !== null && cachedAuthJson.length !== 0) {
      cachedAuth = {...cachedAuth, ...pick(JSON.parse(cachedAuthJson), LOCALSTORAGE_ITEMS)};
      console.log('<App/>: load auth from localStorage:', cachedAuth);
    }

    this.state = {
      error: null,

      ...cachedAuth
    };
  }

  _updateAuth = auth => {
    document.localStorage.setItem(
      LOCALSTORAGE_KEY,
      JSON.stringify(pick(this.state, LOCALSTORAGE_ITEMS))
    );
    this.setState(auth);
  };

  componentDidCatch(error) {
    this.setState({error});
  }

  render() {
    const {error, readKey, writeKey, baseId} = this.state;

    // Render error page
    if (error != null) {
      return (
        <div className="App_error">
          <div className="App_error-message">
            <h1>Error: {error.message}</h1>
            <h2>
              <button onClick={() => window.location.reload()}>Reload</button> the page
            </h2>
          </div>
        </div>
      );
    }

    // Determine the right creds to use
    let authenticated = false;
    let apiKey = null;
    let readOnly = true;
    if (writeKey !== null) {
      authenticated = true;
      apiKey = writeKey;
      readOnly = false;
    } else if (readKey !== null) {
      authenticated = true;
      apiKey = readKey;
      readOnly = true;
    } else {
      authenticated = false;
    }

    if (!authenticated) {
      return (
        <div className="App">
          <h1>Login</h1>
          <div>some stuff goes here in the future</div>
        </div>
      );
    }

    return (
      <div className="App">
        <AirtableProvider baseId={baseId} apiKey={apiKey} readOnly={readOnly}>
          <Switch>
            <Route
              path="/essay/:id"
              children={({match}) => (
                <AirtableConsumer
                  children={({base, readOnly}) => (
                    <EssayPage base={base} readOnly={readOnly} essayId={match.params.id} />
                  )}
                />
              )}
            />
            <Route path="*" component={NotFoundPage} />
          </Switch>
        </AirtableProvider>
      </div>
    );
  }
}

export default App;
