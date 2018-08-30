import React, {Component} from 'react';
import {Route, Redirect, Switch} from 'react-router';
import {AirtableConnector} from './Airtable.js';
import {pick} from 'lodash-es';
import {Helmet} from 'react-helmet';
import './App.css';

import EssayPage from '../pages/EssayPage.js';
import ListPage from '../pages/ListPage.js';
import LoginPage from '../pages/LoginPage.js';
import AccessPage from '../pages/AccessPage.js';
import NotFoundPage from '../pages/NotFoundPage.js';

class App extends Component {
  constructor(props) {
    super(props);

    let cachedAuth = {
      // Sensible airtable auth defaults
      readKey: null,
      writeKey: null,
      baseId: null
    };
    const cachedAuthJson = window.localStorage.getItem(App._localstorageKey);
    if (cachedAuthJson !== null && cachedAuthJson.length !== 0) {
      cachedAuth = {...cachedAuth, ...pick(JSON.parse(cachedAuthJson), App._authKeys)};
      console.log('<App/>: load auth from localStorage:', cachedAuth);
    }

    this.state = {
      error: null,

      ...cachedAuth
    };
  }

  static _localstorageKey = 'airtable-auth';
  static _authKeys = ['readKey', 'writeKey', 'baseId'];

  _updateAuth = auth => {
    console.log('<App/>: update auth with:', auth);
    auth = {
      ...pick(this.state, App._authKeys),
      ...pick(auth, App._authKeys)
    };
    this.setState(auth);
    window.localStorage.setItem(App._localstorageKey, JSON.stringify(pick(auth, App._authKeys)));
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

    return (
      <div className="App">
        <Helmet titleTemplate="%s | College Essays" />
        <Switch>
          <Route
            path="/access/:slug/"
            children={({match, location}) => (
              <AccessPage
                slug={match.params.slug}
                match={match}
                location={location}
                redirect={match.params.redirect}
                updateAuth={this._updateAuth}
              />
            )}
          />
          {!authenticated && (
            <Switch>
              <Route path="*" children={() => <LoginPage onSubmit={this._updateAuth} />} />
            </Switch>
          )}
          {authenticated && (
            <AirtableConnector baseId={baseId} apiKey={apiKey} readOnly={readOnly}>
              {({base}) => (
                <Switch>
                  {readOnly && (
                    <Route
                      path="/login"
                      children={() => <LoginPage onSubmit={this._updateAuth} />}
                    />
                  )}
                  {!readOnly && <Route path="/login" children={() => <Redirect to="/" />} />}
                  <Route path="/" exact children={() => <ListPage base={base} />} />
                  <Route
                    path="/essay/:id"
                    children={({match}) => (
                      <EssayPage base={base} readOnly={readOnly} essayId={match.params.id} />
                    )}
                  />
                  <Route path="*" component={NotFoundPage} />
                </Switch>
              )}
            </AirtableConnector>
          )}
        </Switch>
      </div>
    );
  }
}

export default App;
