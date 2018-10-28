import React from 'react';
import PropTypes from 'prop-types';
import {lint} from '../lib/lint.js';
import classnames from 'classnames';
import './Lint.css';

const Lint = ({text, className, onHighlight}) => {
  const errors = lint(text);
  return (
    <ul className={classnames('Lint', className)}>
      {errors.map(e => (
        <li
          className={classnames('Lint_item', {'Lint_item-error': e.type === 'error'})}
          onClick={() => (onHighlight ? onHighlight(e) : null)}
          key={`${e.reason}@${e.index}-${e.offset}`}
        >
          <span className="Lint_text">{e.text}</span>
          <span className="Lint_why">{e.why}</span>
        </li>
      ))}
    </ul>
  );
};

Lint.propTypes = {
  text: PropTypes.string,
  className: PropTypes.string,
  onHighlight: PropTypes.func
};

export default Lint;
