import React from 'react';
import PropTypes from 'prop-types';
import {Redirect} from 'react-router';

const AccessPage = ({slug, redirect, match, location, updateAuth}) => {
  // Slug format:
  // readKey,baseId

  const [readKey, baseId] = slug.split(',');

  if (!readKey) {
    throw new Error('No read key provided.');
  }
  if (!baseId) {
    throw new Error('No base ID provided');
  }

  let urlRest = location.pathname.slice(match.url.length);
  if (urlRest.length === 0) {
    urlRest = '/';
  }

  // Update credentials
  updateAuth({readKey, baseId});

  return <Redirect to={urlRest} />;
};

export default AccessPage;
