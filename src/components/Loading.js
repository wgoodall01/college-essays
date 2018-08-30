import React from 'react';
import PropTypes from 'prop-types';
import {FontAwesomeIcon as Fa} from '@fortawesome/react-fontawesome';
import {faCircleNotch} from '@fortawesome/free-solid-svg-icons';
import './Loading.css';

const Loading = ({wrapper, message, children}) => {
  const Wrapper = wrapper || 'h1';
  message = message || 'Loading...';

  return (
    <Wrapper className="Loading">
      <Fa icon={faCircleNotch} spin /> {message}
    </Wrapper>
  );
};

Loading.propTypes = {
  wrapper: PropTypes.element,
  message: PropTypes.node
};

export default Loading;
