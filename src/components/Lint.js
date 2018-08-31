import React from 'react';
import PropTypes from 'prop-types';
import writeGood from 'write-good';
import classnames from 'classnames';
import './Lint.css';

const Lint = ({text, className, onHighlight}) => {
  const errors = writeGood(text);
  for (let err of errors) {
    const splitInd = err.reason.indexOf('"', 2);
    err.text = err.reason.substring(1, splitInd);
    err.why = err.reason.substring(splitInd + 1, err.reason.length);
  }
  return (
    <ul className={classnames('Lint', className)}>
      {errors.map(e => (
        <li
          className="Lint_item"
          onClick={() => (onHighlight ? onHighlight(e) : null)}
          key={`${e.reason}@${e.index}-${e.offset}`}
        >
          <span className="Lint_text">{e.text}</span>
          {e.why}
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
