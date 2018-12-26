import React from 'react';

// This paragraph-izes text.
//   - First: replaces \n\n with a <p>
//   - Second: replaces any \n with a <br>
const Paragraph = ({children}) => {
  const text = children || '';
  let paragraphs = text.split('\n\n').map(para => para.split('\n'));

  return paragraphs.map((para, i) => (
    <p key={i}>
      {para.map((line, j) => (
        <React.Fragment key={j}>
          {line}
          <br />
        </React.Fragment>
      ))}
    </p>
  ));
};

export default Paragraph;
